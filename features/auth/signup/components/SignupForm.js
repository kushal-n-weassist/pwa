"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Input, Button, Divider } from "@heroui/react";
import  BouncingDots  from "@/components/BouncingDots";
import { FaGoogle, FaFacebook, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { createUser, sendEmailOtp, setField } from "../store/signupSlice";
import { z } from "zod";
import { useDeviceId } from "@/hooks/useDeviceId";
import toast from "react-hot-toast";

const signupSchema = z.object({
  first_name: z
    .string()
    .min(3, "Full Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .trim(),
  mobile_no: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .regex(/^[0-9]+$/, "Mobile number must contain only digits"),
});

export default function SignupForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { deviceId } = useDeviceId();

  const { first_name, email, mobile_no, loading } = useSelector(
    (state) => state.signup,
  );

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({
    first_name: false,
    email: false,
    mobile_no: false,
  });

  useEffect(() => {
    const result = signupSchema.safeParse({
      first_name: first_name || "",
      email: email || "",
      mobile_no: mobile_no || "",
    });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setIsValid(false);
    } else {
      setErrors({});
      setIsValid(true);
    }
  }, [first_name, email, mobile_no]);

  // Submit
  const handleSignup = async () => {
    if (!isValid) return;

    const createResult = await dispatch(
      createUser({ first_name, email, mobile_no }),
    );

    console.log("created result ", createResult);
    if (createUser.fulfilled.match(createResult)) {
      await dispatch(sendEmailOtp({ email, deviceId }));
      router.push(`/auth/signup/verify-otp?email=${encodeURIComponent(email)}`);
    } else {
      const errMsg = createResult.payload || "Sign up failed. Please try again.";
      toast.error(String(errMsg));
    }
  };

  const inputStyles = {
    label: "text-white text-sm mb-2",
    inputWrapper: [
      "bg-white",
      "h-12",
      "rounded-xl",
      "px-3",
      "py-3",
      "border-none",
      "shadow-none",
      "focus-within:ring-0",
    ],
    input: "text-sm text-black w-full focus:outline-none",
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1DA1FA] to-[#115F94] rounded-t-[40px] p-8 flex flex-col shadow-2xl overflow-y-auto">
      <div className="flex flex-col gap-6 mt-4">
        <div className="flex flex-col gap-2">
          <label className={inputStyles.label}>Full Name</label>
          <Input
            placeholder="Enter Full Name"
            variant="flat"
            value={first_name || ""}
            onBlur={() => setTouched((prev) => ({ ...prev, first_name: true }))}
            onChange={(e) => {
              setTouched((prev) => ({ ...prev, first_name: true }));
              dispatch(
                setField({ field: "first_name", value: e.target.value }),
              );
            }}
            classNames={inputStyles}
          />
          {touched.first_name && errors.first_name && (
            <p className="text-red-200 text-xs px-1">{errors.first_name[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className={inputStyles.label}>Email Address</label>
          <Input
            placeholder="Enter Email"
            variant="flat"
            value={email || ""}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            onChange={(e) => {
              setTouched((prev) => ({ ...prev, email: true }));
              dispatch(setField({ field: "email", value: e.target.value }));
            }}
            classNames={inputStyles}
          />
          {touched.email && errors.email && (
            <p className="text-red-200 text-xs px-1">{errors.email[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className={inputStyles.label}>Mobile Number</label>
          <Input
            placeholder="Enter Mobile Number"
            variant="flat"
            value={mobile_no || ""}
            onBlur={() => setTouched((prev) => ({ ...prev, mobile_no: true }))}
            onChange={(e) => {
              setTouched((prev) => ({ ...prev, mobile_no: true }));
              dispatch(setField({ field: "mobile_no", value: e.target.value }));
            }}
            classNames={inputStyles}
          />
          {touched.mobile_no && errors.mobile_no && (
            <p className="text-red-200 text-xs px-1">{errors.mobile_no[0]}</p>
          )}
        </div>

        <div className="flex w-full justify-center">
          <Button
            isDisabled={!isValid || loading}
            onPress={handleSignup}
            className={`
                font-bold h-12 rounded-xl mt-4 w-3/4 transition-all duration-200
                ${isValid && !loading
                  ? "bg-white text-[#2196F3] hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-white/40 text-white/70 cursor-not-allowed pointer-events-none"
                }
            `}
          >
            {loading ? <BouncingDots /> : "Sign Up"}
          </Button>
        </div>

        {/* Footer Section */}
        <div className="mt-auto flex flex-col items-center gap-6 pb-4">
          <div className="flex items-center w-full gap-4">
            <Divider className="flex-1 h-[1px] bg-white/60" />
            <span className="text-white text-xs font-medium">Or</span>
            <Divider className="flex-1 h-[1px] bg-white/60" />
          </div>
          <div className="flex gap-6">
            <button className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
              <FaGoogle className="text-red-500" />
            </button>
            <button className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
              <FaFacebook className="text-blue-600" />
            </button>
            <button className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
              <FaLinkedin className="text-blue-700" />
            </button>
          </div>
          <p className="text-white text-sm">
            Already have an account?{" "}
            <span className="text-red-300 font-semibold cursor-pointer">
              <Link href="/auth/login">Sign In</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
