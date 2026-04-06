"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { OTPInput } from "input-otp";
import toast from "react-hot-toast";

import { verifyDetailsOtp, submitSSRForVerification } from "@/features/verifydetails/store/verifySlice";

import BouncingDots from "@/components/BouncingDots";

export default function OtpVerificationSheet({ onClose }) {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();


    const { email } = useSelector((state) => state.login);
    const { selectedSSRName } = useSelector((state) => state.dashboard);
    const { loading } = useSelector((state) => state.verify);

    const handleVerifyOtp = async () => {
        const ssrName = selectedSSRName;


        const verifyResult = await dispatch(verifyDetailsOtp({ email, otp }));

        if (verifyDetailsOtp.fulfilled.match(verifyResult)) {

            const submitResult = await dispatch(submitSSRForVerification(ssrName));

            if (submitSSRForVerification.fulfilled.match(submitResult)) {
                toast.success("Details Verified & Submitted Successfully!");
                onClose();
                router.push("/application-submit");
            } else {
                toast.error(submitResult.payload || "Submission failed. Please try again.");
            }
        } else {
            toast.error(verifyResult.payload || "Invalid OTP. Please check and try again.");
        }
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
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
                containerClassName="flex gap-2 justify-center my-4"
                render={({ slots }) => (
                    <>
                        {slots.map((slot, idx) => (
                            <Slot key={idx} {...slot} />
                        ))}
                    </>
                )}
            />

            <Button
                onPress={handleVerifyOtp}
                isDisabled={otp.length !== 6 || loading}
                className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-all"
            >
                {loading ? <BouncingDots /> : "Verify"}
            </Button>
        </div>
    );
}

function Slot(props) {
    return (
        <div
            className={`
    relative w-12 h-15 text-lg font-bold
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