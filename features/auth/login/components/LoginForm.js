"use client";

import { useState, useEffect } from "react";
import { Input, Button, Divider } from "@heroui/react";
import { FaGoogle, FaFacebook, FaLinkedin } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setLoginField, generateLoginOtp, setAuthToken } from "../../login/store/loginSlice";
import { z } from "zod";
import toast from "react-hot-toast";
import BouncingDots from "@/components/BouncingDots";
import { useGoogleLogin } from "@react-oauth/google";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useDeviceId } from "@/hooks/useDeviceId";

const FRAPPE_URL = process.env.NEXT_PUBLIC_FRAPPE_URL;

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
    const { deviceId } = useDeviceId();
    const [emailError, setEmailError] = useState("");
    const [googleLoading, setGoogleLoading] = useState(false);
    const [linkedInLoading, setLinkedInLoading] = useState(false);
    const [facebookLoading, setFacebookLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            try {
                console.log("Google token received:", tokenResponse.access_token);
                // TODO: uncomment when backend is ready
                // const res = await fetch(`${FRAPPE_URL}/api/method/weassist.api.auth.google_login`, {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify({ token: tokenResponse.access_token }),
                // });
                // const data = await res.json();
                // if (data.message?.success) {
                //     dispatch(setAuthToken(data.message.token));
                //     localStorage.setItem("userToken", data.message.token);
                //     toast.success("Logged in successfully");
                //     router.push("/dashboard");
                // } else {
                //     toast.error(data.message?.message || "Login failed");
                // }
                toast.success("Google token received — backend integration pending");
            } catch {
                toast.error("Something went wrong. Please try again.");
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: () => {
            toast.error("Google login failed. Please try again.");
            setGoogleLoading(false);
        },
    });

    const { linkedInLogin } = useLinkedIn({
        clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
        redirectUri: "http://localhost:3000/auth/linkedin/callback",
        scope: "openid profile email",
        onSuccess: async (code) => {
            setLinkedInLoading(true);
            try {
                console.log(" LinkedIn code received:", code);
                // TODO: uncomment when backend is ready
                // const res = await fetch(`${FRAPPE_URL}/api/method/weassist.api.auth.linkedin_login`, {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify({ code }),
                // });
                // const data = await res.json();
                // if (data.message?.success) {
                //     dispatch(setAuthToken(data.message.token));
                //     localStorage.setItem("userToken", data.message.token);
                //     toast.success("Logged in successfully");
                //     router.push("/dashboard");
                // } else {
                //     toast.error(data.message?.message || "Login failed");
                // }
                toast.success("LinkedIn code received — backend integration pending");
            } catch {
                toast.error("Something went wrong. Please try again.");
            } finally {
                setLinkedInLoading(false);
            }
        },
        onError: () => {
            toast.error("LinkedIn login failed. Please try again.");
            setLinkedInLoading(false);
        },
    });

    const handleFacebookSuccess = async (response) => {
        setFacebookLoading(true);
        try {
            console.log("Facebook token received:", response.accessToken);
            // TODO: uncomment when backend is ready
            // const res = await fetch(`${FRAPPE_URL}/api/method/weassist.api.auth.facebook_login`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ token: response.accessToken }),
            // });
            // const data = await res.json();
            // if (data.message?.success) {
            //     dispatch(setAuthToken(data.message.token));
            //     localStorage.setItem("userToken", data.message.token);
            //     toast.success("Logged in successfully");
            //     router.push("/dashboard");
            // } else {
            //     toast.error(data.message?.message || "Login failed");
            // }
            toast.success("Facebook token received — backend integration pending");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setFacebookLoading(false);
        }
    };

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
            await dispatch(generateLoginOtp({ email, deviceId })).unwrap();
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
                                "h-full", "flex", "items-center", "py-3",
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
                        className="bg-white primary-color-blue font-bold h-14 rounded-xl w-full text-lg shadow-lg active:scale-95 transition-transform"
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
                        {/* Google */}
                        <button
                            onClick={() => handleGoogleLogin()}
                            disabled={googleLoading}
                            className="bg-white w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                        >
                            {googleLoading
                                ? <span className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                                : <FaGoogle className="text-red-500" />
                            }
                        </button>

                        {/* Facebook */}
                        <FacebookLogin
                            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
                            onSuccess={handleFacebookSuccess}
                            onFail={() => {
                                toast.error("Facebook login failed. Please try again.");
                                setFacebookLoading(false);
                            }}
                            render={({ onClick }) => (
                                <button
                                    onClick={onClick}
                                    disabled={facebookLoading}
                                    className="bg-white w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                                >
                                    {facebookLoading
                                        ? <span className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                                        : <FaFacebook className="text-blue-600" />
                                    }
                                </button>
                            )}
                        />

                        {/* LinkedIn */}
                        <button
                            onClick={linkedInLogin}
                            disabled={linkedInLoading}
                            className="bg-white w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                        >
                            {linkedInLoading
                                ? <span className="w-4 h-4 border-2 border-gray-300 border-t-blue-700 rounded-full animate-spin" />
                                : <FaLinkedin className="text-blue-700" />
                            }
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