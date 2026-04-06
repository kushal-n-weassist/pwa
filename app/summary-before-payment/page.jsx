"use client";

import React, { Suspense, useState } from "react";
import { ChevronLeft, Activity, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useDispatch, useSelector } from "react-redux";
import { createPdaFundBlock } from "@/features/payments/store/paymentSlice";
import toast from "react-hot-toast";

function SummaryContent() {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const partnerName = searchParams.get("partner") || "Finzy";
    const ssrFromUrl = searchParams.get("ssr");
    const { selectedSSRName } = useSelector((state) => state.dashboard);
    const { blockAmount } = useSelector((state) => state.stages || { blockAmount: 0 });
    const ssrId = ssrFromUrl || selectedSSRName;

    const [isProcessing, setIsProcessing] = useState(false);

    // Simulate real component data logic
    const hospitalName = "WA Hospital - Demo";

    // Format display name from partner identifier smoothly
    let displayName = partnerName;
    if (partnerName.toLowerCase() === "digisparsh") displayName = "Own Funds by DigiSparsh";
    if (partnerName.toLowerCase() === "finzy") displayName = "Loan By Finzy";

    const handleBack = () => router.back();
    
    const handleProceed = async () => {
        if (!ssrId) {
            toast.error("SSR ID not found. Please try again.");
            return;
        }

        setIsProcessing(true);
        try {
            const resultAction = await dispatch(createPdaFundBlock({ 
                ssr: ssrId, 
                fintech_partner: partnerName 
            }));
            
            if (createPdaFundBlock.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload?.message || "Fund Block created successfully.");
                // As requested, user stays on this page after success
            } else {
                toast.error(resultAction.payload || "Failed to create fund block");
            }
        } catch (error) {
            console.error("Fund Block API Error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f8f9fc] flex flex-col relative pb-32">
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            {/* Blue Header Area Background & Geometry */}
            <div className="bg-[#1DA1FA] rounded-b-[40px] pt-12 pb-14 px-4 flex flex-col items-center relative shadow-sm">
                <div className="w-full flex items-center justify-between relative z-10 mb-8">
                    <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center shrink-0">
                        <ChevronLeft size={30} className="text-white" strokeWidth={2.5} />
                    </button>
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[20px] font-bold text-white tracking-wide">
                        Summary
                    </h1>
                    <div className="w-10 h-10"></div> {/* Spacer for flex balance */}
                </div>
                
                {/* Center Glowing Icon */}
                <div className="relative mt-2">
                    <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 scale-125"></div>
                    <div className="w-[110px] h-[110px] bg-white rounded-full flex items-center justify-center relative z-20 shadow-[0_0_30px_rgba(255,255,255,0.7)]">
                        {/* Generic Star of Life / Medical Cross symbol analogue */}
                        <Activity className="text-[#1DA1FA]" size={55} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* List Property Forms */}
            <div className="px-6 flex-1 flex flex-col gap-[18px] mt-10">
                
                {/* Hospital Name Box */}
                <div>
                    <h2 className="text-gray-900 font-bold text-[15px] mb-2 pl-1">Hospital Name</h2>
                    <div className="bg-[#ebebeb] rounded-xl px-5 py-4">
                        <p className="text-gray-400 font-semibold text-[14px]">{hospitalName}</p>
                    </div>
                </div>

                {/* Selected Partner Display */}
                <div>
                    <div className="bg-[#ebebeb] rounded-xl px-5 py-4">
                        <p className="text-gray-400 font-semibold text-[14px]">{displayName}</p>
                    </div>
                </div>

                {/* Fulfilled By Section */}
                <div className="mt-2">
                    <h2 className="text-gray-900 font-bold text-[15px] mb-3 pl-1">Fulfilled by</h2>
                    {/* Brand Card Mockup */}
                    <div className="bg-[#ededed] rounded-xl p-8 flex items-center justify-center min-h-[140px]">
                        <div className="text-center flex flex-col items-center mt-2">
                            {partnerName.toLowerCase() === "digisparsh" ? (
                                <span className="text-gray-700 font-extrabold text-[32px] tracking-tight">DIGISPARSH</span>
                            ) : (
                                <>
                                    <span className="text-[#3b1c9a] font-extrabold text-[44px] leading-none tracking-tight">fin<span className="text-[34px] font-medium align-middle">⇄</span>y</span>
                                    <span className="text-[#3b1c9a] text-[11px] font-bold tracking-[0.2em] mt-2 opacity-80 uppercase">finance is easy</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Fixed Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-transparent px-5 pb-8 pt-4">
                <button 
                    onClick={handleProceed}
                    disabled={isProcessing}
                    className="w-full bg-[#1DA1FA] hover:brightness-95 text-white font-bold text-[17px] py-[16px] rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Processing...
                        </>
                    ) : (
                        "Proceed"
                    )}
                </button>
            </div>
            
            {/* Safe Area Notch Block */}
            <div className="fixed bottom-0 left-0 right-0 h-4 bg-white/20"></div>
        </main>
    );
}

export default function SummaryBeforePaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <SummaryContent />
        </Suspense>
    );
}
