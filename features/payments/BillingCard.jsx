
export default function BillingCard() {
    const details = [
        { label: "Charges for Priority Discharge", amount: 3000 },
        { label: "Hospital Bill Amount Estimate", amount: 70000 },
        { label: "Total Amount to be blocked", amount: 73000 }
    ];

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="space-y-4">
                {details.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">{item.label}</span>
                        <span className="font-semibold text-gray-900">₹{item.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    )
} 