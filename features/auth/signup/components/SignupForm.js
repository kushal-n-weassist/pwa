"use client";
import React, { useState } from "react";
import { Input, Button, Divider } from "@heroui/react";
import {
  FaGoogle,
  FaFacebook,
  FaLinkedin,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import Link from "next/link";
import { useDispatch,useSelector } from "react-redux";



export default function SignupForm() {
  const dispatch = useDispatch();
  const { username, password, confirmPassword } = useSelector(
    (state) => state.signup
  );

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1DA1FA] to-[#115F94] rounded-t-[40px] p-8 flex flex-col shadow-2xl">
      <div className="flex flex-col gap-6 mt-4">

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Username</label>
          <Input
            placeholder="Enter Username"
            variant="flat"
            value={username}
            onChange={(e) => dispatch(
              setSignupField({ field: "username", value: e.target.value })
            )}
            classNames={{
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
              input: [
                "text-sm",
                "text-black",
                "w-full",
                "focus:outline-none",
              ],
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Password</label>
          <Input
            placeholder="Enter Password"
            variant="flat"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => dispatch(
              setSignupField({ field: "password", value: e.target.value })
            )}
            classNames={{
              base: "relative w-full h-12",
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
              input: [
                "text-sm",
                "text-black",
                "w-full",
                "pr-10",
                "focus:outline-none",
              ],
            }}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm">Confirm Password</label>
          <Input
            placeholder="Re-enter Password"
            variant="flat"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => dispatch(
              setSignupField({ field: "confirmPassword", value: e.target.value })
            )} 
            classNames={{
              base: "relative w-full h-12",
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
              input: [
                "text-sm",
                "text-black",
                "w-full",
                "pr-10",
                "focus:outline-none",
              ],
            }}
            endContent={
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            }
          />

          {confirmPassword.length > 0 && (
            <p
              className={`text-[10px] mt-1 ${passwordsMatch ? "text-green-200" : "text-red-200"
                }`}
            >
              {passwordsMatch
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}
        </div>

        <div className="flex w-full justify-center">
          <Button
            isLoading={loading}
            className="bg-white text-[#2196F3] font-bold h-12 rounded-xl mt-2 w-3/4"
            isDisabled={!passwordsMatch}
          >
            Sign Up
          </Button>
        </div>

        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          <div className="flex items-center w-full gap-4 my-2">
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
              <Link href='/auth/login'>Sign In</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
