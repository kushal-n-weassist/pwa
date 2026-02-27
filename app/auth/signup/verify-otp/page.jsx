"use client";

import React from "react";
import { Button, InputOtp } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setField, verifyEmailOtp } from "@/features/auth/signup/store/signupSlice";


export default function VerifyOtpPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { email, otp, loading } = useSelector((state) => state.signup);


  const handleVerify = async () => {

    if (otp.length !== 6) return;

    const result = await dispatch(verifyEmailOtp({ email, otp }));
    console.log("the otp result",result);
    
    if (verifyEmailOtp.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#1DA1FA] to-[#115F94] p-8 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-[32px] w-full flex flex-col gap-6 shadow-xl max-w-md">
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Verify Email</h2>
          <p className="text-gray-500 text-sm mt-2">
            We sent a code to <br />
            <b className="text-[#1DA1FA]">{email || "your email"}</b>
          </p>
        </div>

        <div className="flex justify-center w-full py-4">
          <InputOtp
            length={6}
            value={otp}
            onValueChange={(value) => dispatch(setField({ field: "otp", value }))}
            variant="flat"
            classNames={{
              // segmentWrapper forces the horizontal row and prevents vertical stacking
              segmentWrapper: "flex flex-row gap-2 justify-center",
              segment: [
                "w-10 h-14 sm:w-12", // Fixed width prevents stacking on small screens
                "bg-[#EDEDED]",
                "rounded-xl",
                "gap-x-2",
                "border-none",
                "text-xl font-bold text-gray-900",
                "data-[active=true]:ring-2 data-[active=true]:ring-[#1DA1FA]"
              ],
            }}
          />
        </div>

        {/* Action Button */}
        <Button
          isLoading={loading}
          onPress={handleVerify}
          isDisabled={otp.length !== 6}
          className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl shadow-lg mt-2 active:scale-95 transition-transform"
        >
          Verify & Continue
        </Button>

        {/* Navigation Back */}
        <button
          onClick={() => router.back()}
          className="text-gray-400 text-xs font-semibold underline text-center active:opacity-50"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}