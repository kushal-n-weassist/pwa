"use client";
import Stepper from "@/features/stages/components/Stepper";
import { ChevronLeft, FileUp } from "lucide-react";
import { useRouter } from "next/navigation";

const STAGES = [
    { id: 1, label: "Start New Request", status: "completed" },
    { id: 2, label: "SSR Created", status: "completed" },
    { id: 3, label: "Medical", status: "completed" },
    { id: 4, label: "OTP Apllication", status: "completed" },
    { id: 5, label: "Admissibility", status: "completed" },
    { id: 6, label: "Calculation of amount to be blocked", status: "completed" },
    {
        id: 7, label: "Select Fintech Partner to proceed",
        description: "Select Fintech Partner and Pay Amount",
        status: "active",
        actionLabel: "View and Pay Amount"
    },
    { id: 8, label: "Request Acceptance Letter", status: "pending" },
    { id: 9, label: "Intimate Discharge", status: "pending" },
    { id: 10, label: "Hospital Bill", status: "pending" },
    { id: 11, label: "Difference Amount Blocking", status: "pending" },
]



export default function StagesPage() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };
    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-md">
                {/* heading */}
                <div className="relative mb-8 flex items-center justify-center">
                    <button className="absolute left-0 top-0 mb-8 text-center text-xl font-extrabold" onClick={handleBack}>
                        <ChevronLeft size={28} strokeWidth={3} />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-900">Stages</h1>
                </div>

                {/* Stepper */}
                <Stepper stages={STAGES} />
            </div>
        </main>
    );
}    