"use client";

import { useState, useEffect } from "react";
import { Input, Button, Divider } from "@heroui/react";
import { FaGoogle, FaFacebook, FaLinkedin } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setLoginField, generateLoginOtp } from "../../login/store/loginSlice";
import { z } from "zod";
import toast from "react-hot-toast";
import BouncingDots from "@/components/BouncingDots";


const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email address is required")
        .email("Please enter a valid email address"),
});




export default function LoginForm() {
    const dispatch = useDispatch();
    const router = useRouter();

    const { email, loading } = useSelector((state) => state.login);
    const [emailError, setEmailError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const hasError = !!emailError;

    const handleContinue = async () => {
        const result = loginSchema.safeParse({ email: email?.trim() ?? "" });

        if (!result.success) {
            setEmailError(result.error.issues[0].message);
            return;
        }

        setEmailError("");

        try {
            await dispatch(generateLoginOtp({ email })).unwrap();
            toast.success(`OTP sent to ${email}`);
            router.push(`/auth/login/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err) {
            toast.error(err || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="h-full w-full bg-gradient-blue rounded-t-[40px] p-8 flex flex-col shadow-2xl">
            <div className="flex flex-col gap-6 mt-4">
                <h1 className="text-white text-2xl font-bold mb-2">Login with OTP</h1>

                <div className="flex flex-col gap-1">
                    <label className="text-white text-sm">Email Address</label>
                    <Input
                        placeholder="Enter your registered email"
                        variant="flat"
                        value={email ?? ""}
                        isInvalid={hasError}
                        onChange={(e) => {
                            dispatch(setLoginField({ field: "email", value: e.target.value }));
                            if (emailError) setEmailError("");
                        }}
                        classNames={{
                            inputWrapper: [
                                "input-wrapper-base",
                                hasError ? "input-wrapper-error" : "input-wrapper-normal",
                                "h-full","flex","items-center", "py-3",
                            ],
                            input: "input-base text-lg",
                        }}
                    />
                    {hasError && (
                        <p className="text-red-200 text-xs font-medium mt-1 px-1">
                            {emailError}
                        </p>
                    )}
                </div>

                <div className="flex w-full justify-center mt-4">
                    <Button
                        isDisabled={loading}
                        onPress={handleContinue}
                        className="bg-white primary-color-blue  font-bold h-14 rounded-xl w-full text-lg shadow-lg active:scale-95 transition-transform"
                    >
                        {loading ? <BouncingDots /> : "Continue"}
                    </Button>
                </div>

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
                        Don&apos;t have an account?{" "}
                        <span className="text-red-300 font-semibold cursor-pointer">
                            <Link href="/auth/signup">Sign Up</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}