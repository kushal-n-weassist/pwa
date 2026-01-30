"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { OTPInput } from "input-otp";

export default function OtpVerificationSheet({ onClose }) {
    const [otp, setOtp] = useState("");

    const handleVerify = () => {
        console.log("OTP entered:", otp);
        onClose();
    };

    return (
        <div className="p-8 flex flex-col items-center gap-6">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-2" />

            <div className="text-center">
                <h3 className="text-xl font-extrabold text-gray-900">Enter OTP</h3>
                <p className="text-[13px] text-[#A5B3CD] font-medium mt-1">
                    Enter the OTP provided by the hospital.
                </p>
            </div>

            <OTPInput
                maxLength={4}
                value={otp}
                onChange={setOtp}
                containerClassName="flex gap-4 justify-center my-4"
                render={({ slots }) => (
                    <>
                        {slots.map((slot, idx) => (
                            <Slot key={idx} {...slot} />
                        ))}
                    </>
                )}
            />

            <Button
                onPress={handleVerify}
                isDisabled={otp.length !== 4}
                className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg disabled:opacity-50"
            >
                Verify
            </Button>
        </div>
    );
}

function Slot(props) {
    return (
        <div
            className={`
                relative w-14 h-14 text-xl font-bold
                flex items-center justify-center
                transition-all duration-300
                border-2 rounded-xl
                ${props.isActive ? 'border-[#1DA1FA] bg-blue-50' : 'border-gray-200 bg-[#EDEDED]'}
            `}
        >
            {props.char !== null && <div className="text-gray-900">{props.char}</div>}
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    );
}

function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-[#1DA1FA]" />
        </div>
    );
}