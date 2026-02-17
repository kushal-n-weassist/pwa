"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button, useDisclosure } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

import MedicalInfoStep from "@/features/verifydetails/components/MedicalInfoStep";
import ProblemTreatmentStep from "@/features/verifydetails/components/ProblemTreatmentStep";
import HealthConditionsStep from "@/features/verifydetails/components/HealthConditionsStep";
import OtpVerificationSheet from "@/features/verifydetails/components/Otpverification";
import RaiseIssueSheet from "@/features/verifydetails/components/RaiseIssueSheet";

export default function VerifyDetailsPage() {
    const [step, setStep] = useState(1);
    const [activeModal, setActiveModal] = useState(null); 
    const router = useRouter();

    const handleAction = () => {
        if (step < 3) {
            setStep((s) => s + 1);
        } else {
            setActiveModal("otp");
        }
    };

    const prevStep = () => {
        if (step === 1) router.back();
        else setStep((s) => s - 1);
    };

    const handleRaiseIssue = () => {
        setActiveModal("issue");
    };

    const handleIssueSuccess = () => {
        setActiveModal(null);
        router.push("/issue-raised-success");
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-roboto font-light flex flex-col">
            <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-30">
                <button onClick={prevStep} className="p-1 active:opacity-50">
                    <ChevronLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Verify Details</h1>
                <div className="w-6" />
            </div>

            <div className="flex-1 p-5 pb-40 overflow-y-auto">
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Medical details</h2>
                    <p className="text-sm text-gray-500 mb-6 font-normal">Fill in all the appropriate details.</p>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step === 1 && <MedicalInfoStep />}
                            {step === 2 && <ProblemTreatmentStep />}
                            {step === 3 && <HealthConditionsStep />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex flex-col gap-3 z-20">

                <Button
                    onPress={handleAction}
                    className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-[0.98] transition-transform"
                >
                    {step === 3 ? "Verify" : "Continue"}
                </Button>
                {step === 3 && (
                    <p className="text-center text-[12px] text-gray-500 mb-1">
                        Incorrect Details?{" "}
                        <span
                            onClick={handleRaiseIssue}
                            className="text-red-500 font-bold underline cursor-pointer"
                        >
                            Click here to raise an issue
                        </span>
                    </p>
                )}
            </div>

            {activeModal === "otp" && (
                <div className="fixed inset-0 z-[9999] flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-[#212121]/50 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    <div className="relative w-full max-w-md rounded-t-[32px] bg-white pb-10 shadow-xl animate-slide-up">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <OtpVerificationSheet onClose={closeModal} />
                    </div>
                </div>
            )}

            {activeModal === "issue" && (
                <div className="fixed inset-0 z-[9999] flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-[#212121]/50 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    <div className="relative w-full max-w-md rounded-t-[32px] bg-white shadow-xl animate-slide-up">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <RaiseIssueSheet onClose={closeModal} onSuccess={handleIssueSuccess} />
                    </div>
                </div>
            )}
        </div>
    );
}