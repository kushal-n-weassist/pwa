"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Divider, cn } from "@heroui/react";
import { FaGoogle, FaFacebook, FaLinkedin, FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { setLoginField, loginUser } from "../../login/store/loginSlice";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
    const { isAuthenticated, error } = useSelector((state) => state.login);
    const router = useRouter();
    const dispatch = useDispatch();
    const { username, password, loading } = useSelector(
        (state) => state.login
    );
    const [showpassord, setShowpassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleLogin = () => {
        const result = loginSchema.safeParse({
            username: username?.trim(),
            password: password?.trim(),
        });

        if (!result.success) {
            const errors = {};
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0];
                if (!errors[fieldName]) {
                    errors[fieldName] = issue.message;
                }
            });

            setFieldErrors(errors);
            console.log("the fiels error", fieldErrors);
            return;
        }

        setFieldErrors({});
        dispatch(loginUser({ username, password }));
    };


    useEffect(() => {
        if (isAuthenticated === true) {
            addToast({
                title: "Success",
                description: "Welcome back to your dashboard",
                variant: "flat",
                classNames: {
                    base: [
                        "bg-white/90 backdrop-blur-md",
                        "border-none",
                        "rounded-2xl",
                        "shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
                        "px-4 py-3",
                        "min-w-[300px]"
                    ],
                    title: "text-[#115F94] font-bold text-sm",
                    description: "text-gray-500 text-xs font-medium",
                    icon: "text-green-500",
                },
            });


            router.push('/dashboard')
        }
    }, [isAuthenticated, router])

    useEffect(() => {
        console.log("the error changed in effect ", error);
        if (error) {

            addToast({
                title: "Login  Failed",
                description: `Could not able to login ${error}`,
                color: "danger",
                variant: "flat",
            });
        }
    }, [error]);



    return (
        <div className="h-full w-full bg-gradient-to-b from-[#1DA1FA] to-[#115F94] rounded-t-[40px] p-8 flex flex-col shadow-2xl">
            <div className="flex flex-col gap-6 mt-4">

                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm">Username</label>
                    <Input
                        placeholder="Enter Username"
                        variant="flat"
                        value={username || ""}
                        isInvalid={!!fieldErrors.username}
                        errorMessage={fieldErrors.username}
                        onChange={(e) =>
                            dispatch(setLoginField({ field: "username", value: e.target.value }))
                        }
                        classNames={{
                            inputWrapper: [
                                "bg-white",
                                "h-12",
                                "rounded-xl",
                                "px-3",
                                "py-3",
                                "border",
                                fieldErrors.username ? "border-red-500" : "border-transparent",
                                "shadow-none",
                                "focus-within:ring-0",
                            ],
                            input: "text-sm text-black w-full focus:outline-none",
                            errorMessage: "text-red-600 text-[10px] font-medium mt-1 text-left",
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm">Password</label>
                    <Input
                        placeholder="Enter Password"
                        variant="flat"
                        value={password}
                        type={showpassord ? "text" : "password"}
                        onChange={(e) =>
                            dispatch(setLoginField({ field: "password", value: e.target.value }))
                        }
                        isInvalid={!!fieldErrors.password}
                        errorMessage={fieldErrors.password}
                        classNames={{
                            base: "relative w-full h-12",
                            inputWrapper: [
                                "bg-white",
                                "h-12",
                                "rounded-xl",
                                "px-3",
                                "py-3",
                                "border",
                                fieldErrors.password ? "border-red-500" : "border-transparent",
                                "shadow-none",
                                "focus-within:ring-0",
                            ],
                            input: [
                                "text-sm",
                                "text-black",
                                "w-full",
                                "pr-10",
                                "focus:outline-none",
                            ],
                            errorMessage: "text-red-600 text-[10px] font-medium mt-1 text-left",

                        }}
                        endContent={
                            <button
                                type="button"
                                onClick={() => setShowpassword(!showpassord)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showpassord ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        }
                    />
                </div>

                <div className="flex w-full justify-center items-center">
                    <Button
                        isLoading={loading}
                        isDisabled={loading}
                        onClick={handleLogin}
                        className="bg-white text-[#2196F3] font-bold h-12 rounded-xl mt-4 w-3/4"
                    >
                        Sign In
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
                        <span className="text-red-300 font-semibold">
                            <Link href="/auth/signup">Sign Up</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
