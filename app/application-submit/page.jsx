"use client";

import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import Image from "next/image";
import applicationSubmitSucces from '@/public/applicationsubmissionsuccesfull.svg';

export default function SuccessStep() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white font-roboto font-light">
            <div className="relative mb-10 flex flex-col items-center">
                <Image 
                    src={applicationSubmitSucces} 
                    alt="Success" 
                    height={100} 
                    width={100}
                    priority
                    unoptimized 
                />
            </div>

            <div className="text-center mb-10">
                <h2 className="text-[22px] font-extrabold text-gray-900 mb-1 leading-tight">
                    Application Submitted successfully
                </h2>
                <p className="text-[14px] text-gray-500 font-normal">
                    Application Number-SSR 07 24 2024
                </p>
            </div>

            <Card className="w-full border border-gray-100 shadow-none bg-[#F9FAFB] rounded-[20px] mb-12">
                <CardBody className="p-6 flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] text-gray-700 font-medium font-bold">Charges for Priority Discharge</span>
                        <span className="text-[13px] text-gray-900 font-bold">-</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] text-gray-700 font-medium font-bold">Hospital Bill Amount Estimate</span>
                        <span className="text-[13px] text-gray-900 font-bold">70,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] text-gray-700 font-medium font-bold">Amount to be blocked</span>
                        <span className="text-[13px] text-[#1DA1FA] font-bold">39.05</span>
                    </div>
                </CardBody>
            </Card>

            <Button
                onPress={() => window.location.href = '/dashboard'}
                className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
            >
                Continue
            </Button>
        </div>
    );
}