"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import BillingCard from "@/features/payments/BillingCard";
import { PaymentOption } from "@/features/payments/PaymentOption";
import { BottomPayBar } from "@/features/payments/BottomPayBar";
import { ChevronLeft, Ticket, Wallet, Landmark } from "lucide-react";
import { fetchHospitalBillEstimate } from "@/features/payments/store/paymentSlice";

export default function PaymentsPage() {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const ssrId = searchParams.get("ssr");
    const { hospitalBillEstimate, loading, error } = useSelector((state) => state.payments);

    useEffect(() => {
        if (ssrId) {
            dispatch(fetchHospitalBillEstimate({ ssr: ssrId }));
        }
    }, [dispatch, ssrId]);

    const approxEstimate = hospitalBillEstimate?.approx_estimate || 0;
    const totalAmount = approxEstimate + 3000;

    return (
        <main className="min-h-screen bg-gray-50 pb-32">
            <div className="mx-auto max-w-md px-6 pt-6">
                
                {/* Heading */}
                <div className="relative mb-8 flex items-center justify-center">
                    <button className="absolute left-0 p-1 text-gray-900" onClick={() => window.history.back()}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-900">Payment</h1>
                </div>

                {loading ? (
                    <div className="flex animate-pulse justify-center py-10">
                        <span className="text-gray-500 font-medium">Loading estimate...</span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <BillingCard approxEstimate={approxEstimate} />

                        {/* Offers Section */}
                        <button className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-active active:scale-[0.98]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                    <Ticket className="text-blue-500" size={18} />
                                </div>
                                <span className="font-semibold text-gray-700">Offers</span>
                            </div>
                            <ChevronLeft className="rotate-180 text-gray-400" size={20} />
                        </button>

                        {/* Payment List */}
                        <div>
                            <h2 className="mb-3 px-1 text-lg font-bold text-gray-800">Payments</h2>
                            <div className="overflow-hidden rounded-2xl bg-white px-4 shadow-sm ring-1 ring-black/5">
                                <PaymentOption icon={Wallet} label="DigiSprash" />
                                <PaymentOption icon={Landmark} label="Finzy" isLast />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <BottomPayBar amount={totalAmount} />
        </main>
    );
}