"use client";

import React from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function IssueRaisedSuccess() {
    const router = useRouter();

    const handleContinue = () => {
        router.push("/"); 
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="px-6 pt-12 pb-4 flex items-center">
                <button onClick={() => router.back()} className="p-1 active:opacity-50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-lg text-gray-600 font-medium">
                        Your Issues has been Raised Successfully
                    </p>
                </div>
            </div>

            <div className="p-6 pb-8">
                <Button
                    onPress={handleContinue}
                    className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg"
                >
                    Continue to Home
                </Button>
            </div>
        </div>
    );
}