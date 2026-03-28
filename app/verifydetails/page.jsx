"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

import MedicalInfoStep from "@/features/verifydetails/components/MedicalInfoStep";
import ProblemTreatmentStep from "@/features/verifydetails/components/ProblemTreatmentStep";
import HealthConditionsStep from "@/features/verifydetails/components/HealthConditionsStep";
import OtpVerificationSheet from "@/features/verifydetails/components/Otpverification";
import RaiseIssueSheet from "@/features/verifydetails/components/RaiseIssueSheet";
import BouncingDots from "@/components/BouncingDots";
import { generateVerifyOtp, fetchTnc } from "@/features/verifydetails/store/verifySlice";
import { useSelector, useDispatch } from "react-redux";
import { useRequireScanner } from "@/hooks/useRequireScanner";

export default function VerifyDetailsPage() {
    const [step, setStep] = useState(1);
    const [activeModal, setActiveModal] = useState(null);
    const [tcAccepted, setTcAccepted] = useState(false);
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [tncSubmitting, setTncSubmitting] = useState(false);
    const router = useRouter();
    useRequireScanner();
    const { email } = useSelector((state) => state.login);
    const { selectedSSRName } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();
    const tncHtml = useSelector((state) => state.verify.tncHtml);
    const tncLoading = useSelector((state) => state.verify.tncLoading);

    const handleAction = async () => {
        if (step < 3) {
            setStep((s) => s + 1);
        } else {
            dispatch(fetchTnc());
            setActiveModal("tnc");
        }
    };

    const cleanTnc = (html) => {
        if (!html) return "";
        let cleaned = html
            .replace(/<div class="ql-editor[^"]*">/g, "<div>")
            .replace(/<p>\s*<br>\s*<\/p>/g, "")
            .replace(/<br\s*\/?>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/<\/p>\s*<p>/g, " ")
            .replace(/<p>/g, "")
            .replace(/<\/p>/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();

      
        cleaned = cleaned.replace(
            /(\d+)\.\s*([A-Z][A-Z &,\/\-'()]+(?:\s+[A-Z&,\/\-'()]+)*)/g,
            '<div class="tnc-heading">$1. $2</div>'
        );

        cleaned = cleaned.replace(
            /(<\/div>)\s*(?!<div)/g,
            '$1<div class="tnc-paragraph">'
        );

        cleaned = cleaned.replace(
            /(<div class="tnc-paragraph">)(.*?)(?=<div class="tnc-heading">|$)/g,
            '<div class="tnc-paragraph">$2</div>'
        );

        return cleaned;
    };

    // Pinch-to-zoom logic for T&C content
    const tncContentRef = useRef(null);
    const [tncScale, setTncScale] = useState(1);
    const initialDistance = useRef(null);
    const initialScale = useRef(1);

    const getDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            initialDistance.current = getDistance(e.touches);
            initialScale.current = tncScale;
        }
    }, [tncScale]);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length === 2 && initialDistance.current) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches);
            const ratio = currentDistance / initialDistance.current;
            const newScale = Math.min(Math.max(initialScale.current * ratio, 1), 3);
            setTncScale(newScale);
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        initialDistance.current = null;
    }, []);

    // Ctrl+scroll wheel zoom for desktop
    const handleWheel = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setTncScale((prev) => {
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                return Math.min(Math.max(prev + delta, 1), 3);
            });
        }
    }, []);

    useEffect(() => {
        const el = tncContentRef.current;
        if (!el || activeModal !== "tnc") return;
        el.addEventListener("touchstart", handleTouchStart, { passive: false });
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
        el.addEventListener("touchend", handleTouchEnd);
        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            el.removeEventListener("touchend", handleTouchEnd);
            el.removeEventListener("wheel", handleWheel);
        };
    }, [activeModal, handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

    const handleAcceptTnC = async () => {
        setTncSubmitting(true);
        const result = await dispatch(generateVerifyOtp(email));
        setTncSubmitting(false);
        if (generateVerifyOtp.fulfilled.match(result)) {
            setActiveModal("otp");
        }
    };

    const prevStep = () => {
        if (step === 1) router.back();
        else setStep((s) => s - 1);
    };

    const handleRaiseIssue = () => setActiveModal("issue");
    const handleIssueSuccess = () => {
        setActiveModal(null);
        router.push("/issue-raised-success");
    };
    const closeModal = () => setActiveModal(null);

    const CloseButton = ({ onClick }) => (
        <button
            onClick={onClick}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 z-10"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-roboto font-light flex flex-col">

            <style>{`
    .tnc-content { font-size: 13px; color: #4b5563; line-height: 1.7; }
    .tnc-content p { margin: 0 0 4px 0; padding: 0; line-height: 1.7; text-indent: 0 !important; }
    .tnc-content p:empty { display: none; }
    .tnc-content br { display: none; }
    .tnc-content span { font-size: 13px !important; color: #4b5563 !important; background: transparent !important; text-indent: 0 !important; }
    .tnc-content a { color: #1DA1FA !important; text-decoration: underline; }
    .tnc-content .ql-editor { padding: 0 !important; }
    .tnc-content * { text-indent: 0 !important; margin-left: 0 !important; padding-left: 0 !important; }
    .tnc-content .tnc-heading {
        font-size: 14px;
        font-weight: 700;
        color: #1e293b;
        margin-top: 20px;
        margin-bottom: 8px;
        padding: 8px 12px;
        background: #EBF5FF;
        border-left: 3px solid #1DA1FA;
        border-radius: 6px;
        line-height: 1.5;
    }
    .tnc-content .tnc-heading:first-child { margin-top: 0; }
    .tnc-content .tnc-paragraph {
        font-size: 13px;
        color: #4b5563;
        line-height: 1.75;
        margin-bottom: 12px;
        padding: 0 4px;
        text-align: justify;
    }
`}</style>

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
                    <p className="text-sm text-gray-500 mb-6 font-normal"></p>

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

            {activeModal === "tnc" && (
                <div className="fixed inset-0 z-[9999] flex items-end justify-center">
                    <div className="absolute inset-0 bg-[#212121]/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white pb-6 shadow-xl animate-slide-up" style={{ maxHeight: '92vh', borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
                        <CloseButton onClick={closeModal} />
                        <div className="px-5 pt-6 pb-3 flex flex-col" style={{ maxHeight: '92vh' }}>
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />
                            <h3 className="text-[20px] font-black text-gray-900 mb-1">Terms & Conditions</h3>
                            <p className="text-[13px] text-gray-500 font-medium mb-3">
                                Please read and accept before proceeding.
                            </p>
                            <div
                                ref={tncContentRef}
                                className="overflow-y-auto overflow-x-hidden rounded-2xl border border-gray-100 p-4 mb-4 flex-1"
                                style={{ maxHeight: '60vh', touchAction: 'pan-y' }}
                                onScroll={(e) => {
                                    const { scrollTop, scrollHeight, clientHeight } = e.target;
                                    if (scrollHeight - scrollTop - clientHeight < 30) {
                                        setHasScrolledToBottom(true);
                                    }
                                }}
                            >
                                {tncLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1DA1FA] rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div
                                        className="tnc-content"
                                        style={{ transform: `scale(${tncScale})`, transformOrigin: 'top left', width: `${100 / tncScale}%` }}
                                        dangerouslySetInnerHTML={{ __html: cleanTnc(tncHtml) }}
                                    />
                                )}
                            </div>
                            {!hasScrolledToBottom && (
                                <p className="text-[11px] text-blue-600 mb-2 text-center flex-shrink-0">
                                     Please scroll to the bottom to accept
                                </p>
                            )}
                            <label className={`flex items-start gap-3 mb-4 flex-shrink-0 ${hasScrolledToBottom ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'}`}>
                                <input
                                    type="checkbox"
                                    checked={tcAccepted}
                                    disabled={!hasScrolledToBottom}
                                    onChange={(e) => setTcAccepted(e.target.checked)}
                                    className="mt-0.5 w-5 h-5 accent-[#1DA1FA] cursor-pointer flex-shrink-0"
                                />
                                <span className="text-[13px] text-gray-700 font-medium">
                                    I have read and agree to the Terms & Conditions
                                </span>
                            </label>
                            <Button
                                onPress={handleAcceptTnC}
                                isDisabled={!tcAccepted || tncSubmitting}
                                className={`w-full h-14 rounded-2xl font-bold text-lg transition-all flex-shrink-0 ${tcAccepted && !tncSubmitting
                                    ? "bg-[#1DA1FA] text-white shadow-lg"
                                    : "bg-gray-100 text-gray-400 shadow-none"
                                    }`}
                            >
                                {tncSubmitting ? <BouncingDots /> : "Accept & Continue"}
                            </Button>
                            
                        </div>
                    </div>
                </div>
            )}

            {activeModal === "otp" && (
                <div className="fixed inset-0 z-[9999] flex items-end justify-center">
                    <div className="absolute inset-0 bg-[#212121]/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md rounded-t-[32px] bg-white pb-10 shadow-xl animate-slide-up">
                        <CloseButton onClick={closeModal} />
                        <OtpVerificationSheet onClose={closeModal} />
                    </div>
                </div>
            )}

            {activeModal === "issue" && (
                <div className="fixed inset-0 z-[9999] flex items-end justify-center">
                    <div className="absolute inset-0 bg-[#212121]/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md rounded-t-[32px] bg-white shadow-xl animate-slide-up">
                        <CloseButton onClick={closeModal} />
                        <RaiseIssueSheet ssrId={selectedSSRName} onClose={closeModal} onSuccess={handleIssueSuccess} />
                    </div>
                </div>
            )}
        </div>
    );
}