import { ChevronRight, Wallet, Landmark } from "lucide-react";

export function PaymentOption({ icon: Icon, label, isLast }) {
    return (
        <button className={`flex w-full items-center justify-between py-4 px-2 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">{label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
        </button>
    );
}