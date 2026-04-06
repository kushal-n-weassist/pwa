import BillingCard from "@/features/payments/BillingCard";
import { PaymentOption } from "@/features/payments/PaymentOption";
import { BottomPayBar } from "@/features/payments/BottomPayBar"; // Assuming you kept this component
import { ChevronLeft, Ticket, Wallet, Landmark } from "lucide-react";

export default function PaymentsPage() {
    return (
        <main className="min-h-screen bg-gray-50 pb-32">
            {/* 1. Wrap EVERYTHING in this container to keep it centered and padded */}
            <div className="mx-auto max-w-md px-6 pt-6">
                
                {/* Heading */}
                <div className="relative mb-8 flex items-center justify-center">
                    <button className="absolute left-0 p-1 text-gray-900">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-900">Payment</h1>
                </div>

                {/* 2. Content is now inside the max-width container */}
                <div className="space-y-6">
                    <BillingCard />

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
            </div>

            {/* Sticky Bottom Bar stays outside the padding container to span full width if needed */}
            <BottomPayBar />
        </main>
    );
}