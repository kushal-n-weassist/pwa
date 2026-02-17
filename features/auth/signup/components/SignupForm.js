"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Input, Button, Divider } from "@heroui/react";
import { FaGoogle, FaFacebook, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { createUser, sendEmailOtp, setField } from "../store/signupSlice";

export default function SignupForm() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    const { first_name, email, mobile_no, loading } = useSelector((state) => state.signup);

    const handleSignup = async () => {
        const createResult = await dispatch(createUser({ first_name, email, mobile_no }));
        console.log("creayed result ",createResult);
        if (createUser.fulfilled.match(createResult)) {
            await dispatch(sendEmailOtp({ email }));


            router.push(`/auth/signup/verify-otp?email=${encodeURIComponent(email)}`);
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
        <div className="h-full w-full bg-gradient-to-b from-[#1DA1FA] to-[#115F94] rounded-t-[40px] p-8 flex flex-col shadow-2xl">
            <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col gap-2">
                    <label className={inputStyles.label}>Full Name</label>
                    <Input
                        placeholder="Enter Full Name"
                        variant="flat"
                        value={first_name}
                        onChange={(e) => dispatch(setField({ field: "first_name", value: e.target.value }))}
                        classNames={inputStyles}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className={inputStyles.label}>Email Address</label>
                    <Input
                        placeholder="Enter Email"
                        variant="flat"
                        value={email}
                        onChange={(e) => dispatch(setField({ field: "email", value: e.target.value }))}
                        classNames={inputStyles}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className={inputStyles.label}>Mobile Number</label>
                    <Input
                        placeholder="Enter Mobile Number"
                        variant="flat"
                        value={mobile_no}
                        onChange={(e) => dispatch(setField({ field: "mobile_no", value: e.target.value }))}
                        classNames={inputStyles}
                    />
                </div>

                <div className="flex w-full justify-center">
                    <Button
                        isLoading={loading}
                        onPress={handleSignup}
                        className="bg-white text-[#2196F3] font-bold h-12 rounded-xl mt-4 w-3/4"
                    >
                        Sign Up
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