"use client"
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
    
    const router = useRouter();
    return(
        <div className="flex items-center px-6 py-6">
            <button onClick={() => router.back()} className="p-1 hover: bg-gray-100 rounded-full transition-colors">
                <ChevronLeft size={28} strokeWidth={2.5} className="text-gray-500"/>
            </button>
        </div>
    )
}