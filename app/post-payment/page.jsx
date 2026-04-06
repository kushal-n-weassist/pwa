"use client";

import React, { Suspense, useEffect, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

function PostPaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Status can be: 'processing', 'success', 'error'
    const initialStatus = searchParams.get("status") || "processing";
    const [status, setStatus] = useState(initialStatus);

    // Optional: Auto demo transition for presentation purposes if status is processing
    useEffect(() => {
        if (status === "processing") {
            const timer = setTimeout(() => {
                // By default transition to success for demo (or Razorpay callback would handle this)
                // setStatus("success"); 
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleBack = () => {
        router.back();
    };

    const handleHome = () => {
        router.push("/dashboard");
    };

    // Derived top titles based on explicit state
    const pageTitle = 
        status === "success" ? "Payment Successful" :
        status === "error" ? "Payment Error" :
        "Processing Payment";

    // Grab Redux state
    const { paymentSummary, paymentData } = useSelector((state) => state.payments);
    const { email: userEmail, username } = useSelector((state) => state.login);

    // Dynamic Display Data
    const displayEmail = paymentSummary?.email || userEmail || "N/A";
    const displayContact = paymentSummary?.contact || "N/A";
    
    const rawAmount = paymentSummary?.amount || paymentData?.amount || 0;
    // Assuming amount is in paise, divide by 100
    const convertedAmount = rawAmount > 0 ? (rawAmount / 100).toLocaleString('en-IN') : "0";
    
    let displayDate = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy
    let displayTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // If backend returns a unix timestamp
    const createdAt = paymentSummary?.created_at || paymentData?.created_at;
    if (createdAt) {
        // Some backends return 10-digit unix seconds, JS needs milliseconds
        const isSeconds = String(createdAt).length <= 10;
        const d = new Date(isSeconds ? createdAt * 1000 : createdAt);
        if (!isNaN(d.getTime())) {
            displayDate = d.toLocaleDateString('en-GB');
            displayTime = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    }

    const displayBookingId = paymentSummary?.receipt || paymentData?.receipt || searchParams.get("order_id") || "N/A";

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col relative pb-32">
            {/* Standard Header */}
            <div className="pt-12 pb-6 px-4 flex items-center">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 bg-transparent flex items-center justify-start shrink-0"
                >
                    <ChevronLeft size={28} className="text-gray-900" strokeWidth={2.5} />
                </button>
                <h1 className="flex-1 text-center text-xl font-bold text-gray-900 pr-10 tracking-tight">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex-1 px-6 flex flex-col items-center justify-center">
                
                {/* STATE: PROCESSING */}
                {status === "processing" && (
                    <div className="flex flex-col items-center justify-center -mt-20">
                        <Loader2 className="animate-spin text-blue-600 mb-6" size={40} strokeWidth={3} />
                        <p className="text-gray-500 text-center font-medium leading-relaxed px-4 text-[15px]">
                            Your payment is being processed. Please wait<br />
                            while we redirect you to your UPI app to<br />
                            complete the transaction.
                        </p>
                    </div>
                )}

                {/* STATE: SUCCESS */}
                {status === "success" && (
                    <div className="w-full bg-white rounded-2xl shado   w-[0_5px_30px_rgba(0,0,0,0.06)] p-6 z-10 -mt-20">
                        <p className="text-gray-500 font-semibold text-center text-[15px] mb-8">
                            Your Transaction was Successfull.
                        </p>
                        
                        <div className="flex flex-col gap-6">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Email Address</p>
                                <p className="text-gray-900 font-medium text-[15px]">{displayEmail}</p>
                            </div>
                            
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Contact</p>
                                <p className="text-gray-900 font-medium text-[15px]">{displayContact}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Date of Payment</p>
                                    <p className="text-gray-900 font-medium text-[15px]">{displayDate}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Time of Payment</p>
                                    <p className="text-gray-900 font-medium text-[15px]">{displayTime}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Booking Id</p>
                                    <p className="text-gray-900 font-medium text-[15px]">{displayBookingId}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Amount Paid</p>
                                    <p className="text-gray-900 font-medium text-[15px]">Rs. {convertedAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STATE: ERROR */}
                {status === "error" && (
                    <div className="flex flex-col items-center justify-center -mt-20">
                        <p className="text-gray-500 text-center font-semibold px-4 text-[16px]">
                            Your Transaction was not Successfull. Please try again.
                        </p>
                    </div>
                )}

            </div>

            {/* Bottom Fixed Footer (Rendered identically for both Success and Error per requirements) */}
            {(status === "success" || status === "error") && (
                <div className="fixed bottom-0 left-0 right-0 bg-transparent px-5 pb-8 pt-4">
                    <button 
                        onClick={handleHome}
                        className="w-full bg-[#1DA1FA] hover:brightness-95 text-white font-bold text-[17px] py-[16px] rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Continue to Home
                    </button>
                    {/* Safe Area Notch Block */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[130px] h-[5px] bg-black rounded-full opacity-0 pointer-events-none fade-in"></div>
                </div>
            )}
        </main>
    );
}

export default function PostPaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <PostPaymentContent />
        </Suspense>
    );
}
