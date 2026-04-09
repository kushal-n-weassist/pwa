"use client";

import React, { useState } from "react";
import { Button, InputOtp } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { verifyDetailsOtp, submitSSRForVerification } from "@/features/verifydetails/store/verifySlice";

import BouncingDots from "@/components/BouncingDots";

export default function OtpVerificationSheet({ onClose }) {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();


    const { email } = useSelector((state) => state.login);
    const { selectedSSRName } = useSelector((state) => state.dashboard);
    const { loading, error } = useSelector((state) => state.verify);

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
            <div className="w-14 h-1.5 bg-gray-200 rounded-full mb-2" />

            <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#1DA1FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Hospital Verification</h3>
                <p className="text-[14px] text-gray-500 mt-2 max-w-[260px] leading-relaxed mx-auto">
                    Please enter the secure 6-digit code provided by the hospital
                </p>
            </div>

            <div className="flex flex-col items-center justify-center w-full py-4">
                <InputOtp
                    length={6}
                    value={otp}
                    onValueChange={setOtp}
                    isDisabled={loading}
                    variant="flat"
                    classNames={{
                        segmentWrapper: "flex flex-row gap-3 justify-center w-full",
                        segment: [
                            "w-[46px] h-[56px] sm:w-[50px] sm:h-[60px]",
                            "bg-gray-50 border shadow-sm rounded-xl text-2xl font-bold transition-all duration-200 transform",
                            error ? "border-red-400 text-red-600 bg-red-50/50" : "border-gray-200 text-gray-800",
                            "data-[active=true]:ring-2",
                            error 
                              ? "data-[active=true]:border-red-500 data-[active=true]:ring-red-200 data-[active=true]:bg-red-100"
                              : "data-[active=true]:border-[#1DA1FA] data-[active=true]:ring-blue-100 data-[active=true]:bg-blue-50/50"
                        ],
                    }}
                />
                {error && (
                    <div className="mt-4 animate-appearance-in">
                        <span className="text-red-500 text-[13px] font-semibold bg-red-50 px-4 py-1.5 rounded-full border border-red-100 shadow-sm text-center inline-block">
                            {error}
                        </span>
                    </div>
                )}
            </div>

            <Button
                onPress={handleVerifyOtp}
                isDisabled={otp.length !== 6 || loading}
                className="w-full bg-gradient-to-r from-[#1DA1FA] to-[#0A85D9] text-white font-bold h-14 rounded-xl text-[17px] shadow-[0_8px_20px_rgba(29,161,250,0.3)] hover:shadow-[0_12px_25px_rgba(29,161,250,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none mt-2"
            >
                {loading ? <BouncingDots /> : "Verify"}
            </Button>
        </div>
    );
}