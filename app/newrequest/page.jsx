"use client";
import { Button } from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import VerticalStep from "@/components/VerticalStep";
import { useState } from "react";
import BouncingDots from "@/components/BouncingDots";
import { useRequireScanner } from "@/hooks/useRequireScanner";
const steps = [
    {
        number: "Step One",
        title: "Upload Aadhar and PAN of the Insured & Patient to autofill details.",
        isLast: false,
    },
    {
        number: "Step Two",
        title: "Complete any missing fields in the application.",
        isLast: false,
    },
    {
        number: "Step Three",
        title: "Review and submit for the hospital to process.",
        isLast: false,
    },
    {
        number: "Step Four",
        title: "Verify the info once submitted by the facility.",
        isLast: false,
    },
    {
        number: "Step Five",
        title: "Relax while we handle the rest and update you on progress.",
        isLast: true,
    },
];

export default function GetStarted() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);
    useRequireScanner();

    const handleBack = () => {
        router.back();
    };
    
    const handleContinue = () => {
        setIsNavigating(true);
        router.push('/upload');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col px-6 py-12 relative">
            <div className="flex items-center justify-between mb-10">
                <button 
                    className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
                    onClick={handleBack}
                >
                    <ChevronLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Get Started</h1>
                <div className="w-6" /> 
            </div>

            <div className="flex-grow space-y-0 ml-2">
                {steps.map((step, index) => (
                    <VerticalStep
                        key={index}
                        number={step.number}
                        title={step.title}
                        isLast={step.isLast}
                    />
                ))}
            </div>

            <div className="mt-10 pb-6">
                <Button
                    isLoading={isNavigating}
                    onPress={handleContinue}
                    spinner={<BouncingDots/>}
                    className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}