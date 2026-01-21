"use client";
import { Button, user } from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import VerticalStep from "@/components/VerticalStep";

const steps = [
    {
        number: "Step One",
        title: "Upload documents to autofill the form.",
        isLast: false,
    },
    {
        number: "Step Two",
        title: "Complete any missing fields.",
        isLast: false,
    },
    {
        number: "Step Three",
        title: "Review and submit for the hospital to process.",
        isLast: false,
    },
    {
        number: "Step Four",
        title: "Verify the info once submitted.",
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

    const handleBack = () => {
        router.back();
    };
    
    const handleContinue=()=>{
        router.push('/upload');
    }


    return (
        <div className="min-h-screen bg-white flex flex-col px-6 py-12 relative">
            <div className="flex items-center justify-between mb-10">
                <button className="p-2 -ml-2">
                    <ChevronLeft size={24} className="text-gray-800"  onClick={handleBack}/>
                </button>
                <h1 className="text-xl font-bold text-gray-900 mr-8">Get Started</h1>
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

            <div className="mt-auto pb-6">
                <Button
                    onPress={handleContinue}
                    className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}