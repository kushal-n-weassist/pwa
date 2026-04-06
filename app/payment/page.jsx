"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Ticket, Wallet, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchFintechPartners } from "@/features/fintech-partners/store/fintechSlice";
import { fetchSSRBlockAmount } from "@/features/stages/storage/stagesSlice";
import { fetchHospitalBillEstimate } from "@/features/payments/store/paymentSlice";

export default function PaymentPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.login?.userToken);
    const ssrId = useSelector((state) => state.dashboard?.selectedSSRName);

    const [selectedPartner, setSelectedPartner] = useState(null);

    const { blockAmount } = useSelector((state) => state.stages || { blockAmount: 0 });
    const { hospitalBillEstimate } = useSelector((state) => state.payments);
    const { partners, loading: partnersLoading } = useSelector((state) => state.fintech);

    useEffect(() => {
        if (token) {
            dispatch(fetchFintechPartners());
        }
        if (token && ssrId) {
            dispatch(fetchSSRBlockAmount({ ssr: ssrId }));
            dispatch(fetchHospitalBillEstimate({ ssr: ssrId }));
        }
    }, [dispatch, token, ssrId]);

    const approxEstimate = hospitalBillEstimate?.approx_estimate || 0;

    const handleBack = () => {
        router.back();
    };

    return (
        <main className="min-h-screen bg-[#f3f4f6] flex flex-col relative pb-32">
            {/* Header */}
            <div className="pt-12 pb-6 px-4 flex items-center">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 bg-transparent flex items-center justify-start shrink-0"
                >
                    <ChevronLeft size={28} className="text-gray-900" strokeWidth={2.5} />
                </button>
                <h1 className="flex-1 text-center text-[22px] font-bold text-black pr-10">
                    Payment
                </h1>
            </div>

            <div className="px-5 flex-1 flex flex-col gap-6">
                {/* Summary Card */}
                <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-800 text-[15px]">Charges for Priority Discharge</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-800 text-[15px]">Hospital Bill Amount Estimate</span>
                        <span className="text-gray-900 text-[15px] font-medium">₹{approxEstimate ? Number(approxEstimate).toLocaleString('en-IN') : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-[15px]">Amount to be blocked</span>
                        <span className="text-gray-900 text-[15px] font-medium">₹{blockAmount ? Number(blockAmount).toLocaleString('en-IN') : 0}</span>
                    </div>
                </div>

                {/* Payments Section */}
                <div className="mt-2">
                    <h2 className="text-gray-900 text-[17px] mb-4 pl-1">Payments Partners</h2>
                    
                    <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
                        {partnersLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
                            </div>
                        ) : !partners || partners.length === 0 ? (
                            <p className="text-center text-gray-500 py-8 text-sm">No partners available.</p>
                        ) : (
                            partners.map((partner, idx) => {
                                const isLast = idx === partners.length - 1;
                                // Basic mapping to mimic specific icons from UI
                                const isDigi = partner.name.toLowerCase().includes("digi");
                                
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => setSelectedPartner(partner.name)}
                                        className={`flex flex-col cursor-pointer transition-colors active:bg-gray-100 first:rounded-t-[20px] last:rounded-b-[20px] ${
                                            selectedPartner === partner.name 
                                                ? "bg-blue-50/60 ring-1 ring-inset ring-blue-500/30" 
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between p-5">
                                            <div className="flex items-center gap-4">
                                                {isDigi ? (
                                                    <Wallet className="text-blue-500" size={22} strokeWidth={1.5} />
                                                ) : (
                                                    <Banknote className="text-blue-500" size={22} strokeWidth={1.5} />
                                                )}
                                                <span className="text-gray-500 text-[15px]">{partner.name}</span>
                                            </div>
                                            <ChevronRight className="text-gray-500" size={20} strokeWidth={2} />
                                        </div>
                                        {!isLast && <hr className="mx-5 border-gray-100" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Fixed Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#eef5fd] bg-opacity-[0.98] backdrop-blur-md pt-4 pb-8 px-6 border-t-2 border-blue-500 rounded-t-[10px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="font-bold text-black text-[22px] leading-tight">₹{blockAmount ? Number(blockAmount).toLocaleString('en-IN') : 0}</p>
                        <button className="text-blue-500 text-[13px] font-semibold text-left">
                            View detailed bill
                        </button>
                    </div>
                    <button 
                        onClick={() => selectedPartner && router.push(`/summary-before-payment?partner=${encodeURIComponent(selectedPartner)}`)}
                        disabled={!selectedPartner}
                        className="bg-[#3b82f6] hover:bg-blue-600 disabled:bg-blue-400 disabled:opacity-70 disabled:active:scale-100 text-white font-semibold text-[15px] px-8 py-[14px] rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        Proceed to Pay
                    </button>
                </div>
                {/* Safe area block indicator line mimic */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[130px] h-[5px] bg-black rounded-full opacity-80 pointer-events-none"></div>
            </div>
        </main>
    );
}
