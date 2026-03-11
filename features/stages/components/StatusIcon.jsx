// This handles the visual state of the circle (Checkmark, Warning, or Empty).
import { Check, AlertTriangle } from "lucide-react";

export default function StatusIcon({ status }) {
    if (status === "completed") {
        return (
            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={20} strokeWidth={3} />
            </div>
        );
    }
    if (status === "active") {
        return (
            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white ring-4 ring-blue-500">
                <AlertTriangle size={20} full="currentColor" className="text-white" />
            </div>
        )
    }
    return (
        <div className="z-10 h-8 w-8 rounded-full flex items-center justify-center border-4 border-gray-200 bg-gray-200">
            <div className="h-3 w-3 rounded-full bg-white"></div>
        </div>
    )
}