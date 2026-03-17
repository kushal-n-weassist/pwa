"use client";

import React from "react";
import BouncingDots from "@/components/BouncingDots";
import { Button, InputOtp } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  setLoginField,
  verifyLoginOtp,
} from "@/features/auth/login/store/loginSlice";
import toast from "react-hot-toast";

export default function VerifyOtpContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const reduxEmail = useSelector((state) => state.login.email);
  const email = reduxEmail || searchParams.get("email");

  const { otp, loading } = useSelector((state) => state.login);

  const handleVerifyLogin = async () => {
    if (otp.length !== 6) return;

    try {
      await dispatch(verifyLoginOtp({ email, otp })).unwrap();
      router.push("/dashboard");
    } catch (err) {
      toast.error(err || "Verification failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#1DA1FA] to-[#115F94] p-8 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-[32px] w-full flex flex-col gap-6 shadow-xl max-w-md">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            Login Verification
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter the code sent to <br />
            <b className="text-[#1DA1FA]">{email || "your email"}</b>
          </p>
        </div>

        <div className="flex justify-center w-full py-4">
          <InputOtp
            length={6}
            value={otp}
            onValueChange={(value) =>
              dispatch(setLoginField({ field: "otp", value }))
            }
            variant="flat"
            classNames={{
              segmentWrapper: "flex flex-row gap-2 justify-center",
              segment: [
                "w-10 h-14 sm:w-12",
                "bg-[#EDEDED]",
                "rounded-xl",
                "border-none",
                "text-xl font-bold text-gray-900",
                "data-[active=true]:ring-2 data-[active=true]:ring-[#1DA1FA]",
              ],
            }}
          />
        </div>

        <Button
          onPress={handleVerifyLogin}
          isDisabled={loading || otp.length !== 6}
          className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl shadow-lg mt-2 active:scale-95 transition-transform"
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
          className="text-gray-400 text-xs font-semibold underline text-center active:opacity-50"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
