"use client";

import React, { useState } from "react";
import { Button, Checkbox, Card, CardBody } from "@heroui/react";
import { ChevronLeft, FileUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadDocuments() {
    const router = useRouter();
    const [isSameAsInsured, setIsSameAsInsured] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative">
            <div className="bg-white px-6 pt-12 pb-4 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-1">
                    <ChevronLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 flex-1 text-center mr-8">
                    Upload Documents
                </h1>
            </div>

            <div className="p-6 flex-grow bg-white">
                <Card className="shadow-md border-none rounded-[24px]">
                    <CardBody className="gap-6 p-6">

                        <UploadField label="Patient Aadhar Card" />

                        <div className="flex items-center justify-between ">
                            <span className="text-sm font-semibold text-gray-700">
                                Is The Patient Same As Insured?
                            </span>
                                <Checkbox
                                    className="mb-3"
                                    isSelected={isSameAsInsured}
                                    onValueChange={setIsSameAsInsured}
                                    size="lg"
                                    classNames={{
                                        wrapper: "after:bg-[#1DA1FA]"
                                        
                                    }}
                                />

                        </div>

                        {!isSameAsInsured && (
                            <div className="transition-all duration-300 ease-in-out">
                                <UploadField label="Insured Aadhar Card" />
                            </div>
                        )}

                        <UploadField label="Insured Pan Card" />

                    </CardBody>
                </Card>
            </div>

            <div className="p-6 bg-white">
                <Button
                    className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}

function UploadField({ label }) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 bg-gray-50/50 active:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1DA1FA]">
                    <FileUp size={24} />
                </div>
                <span className="text-[#1DA1FA] font-bold text-sm">Click to Upload</span>
                <span className="text-xs text-gray-400">(Max. File size: 25 MB)</span>
            </div>
        </div>
    );
}