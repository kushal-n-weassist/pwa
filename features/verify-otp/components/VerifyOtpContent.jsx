"use client";

import React from "react";
import BouncingDots from "@/components/BouncingDots";
import { Button, InputOtp } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setLoginField, verifyLoginOtp } from "@/features/auth/login/store/loginSlice";
import toast from "react-hot-toast";
import { useDeviceId } from "@/hooks/useDeviceId";

export default function VerifyOtpContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const reduxEmail = useSelector((state) => state.login.email);
  const email = reduxEmail || searchParams.get("email");
  const { deviceId } = useDeviceId();

  const { otp, loading, error } = useSelector((state) => state.login);

  const handleVerifyLogin = async () => {
    if (otp.length !== 6) return;

    const result = await dispatch(verifyLoginOtp({ email, otp, deviceId }));
    
    if (verifyLoginOtp.fulfilled.match(result)) {
      toast.success("Login Successful!");
      router.push("/");
    } else {
      // The error is already handled and displayed below the OTP input via redux,
      // but we can also toast it if it's explicitly rejected here.
      toast.error(result.payload || "Invalid OTP. Please check and try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center w-full py-6 px-4 gap-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#1DA1FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Verification</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-[250px] mx-auto leading-relaxed">
          Enter the 6-digit code sent to <br />
          <b className="text-gray-900 font-bold">{email || "your email"}</b>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full py-2">
        <InputOtp
          length={6}
          value={otp}
          onValueChange={(value) => dispatch(setLoginField({ field: "otp", value }))}
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
        onPress={handleVerifyLogin}
        isDisabled={loading || otp.length !== 6}
        className="w-full bg-gradient-to-r from-[#1DA1FA] to-[#0A85D9] text-white font-bold h-14 rounded-xl text-[17px] shadow-[0_8px_20px_rgba(29,161,250,0.3)] hover:shadow-[0_12px_25px_rgba(29,161,250,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none"
      >
        {loading ? (
          <span style={{ filter: "brightness(0) invert(1)" }}>
            <BouncingDots />
          </span>
        ) : (
          "Verify & Login"
        )}
      </Button>

      <button
        onClick={() => router.back()}
        className="text-gray-500 hover:text-gray-800 text-sm font-semibold text-center mt-2 active:opacity-70 transition-colors"
      >
        Back to Login
      </button>
    </div>
  );
}