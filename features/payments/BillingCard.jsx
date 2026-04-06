"use client";

import React from "react";

export default function BillingCard({ approxEstimate = 0 }) {
    const priorityDischargeCharge = 3000;
    const totalAmount = priorityDischargeCharge + approxEstimate;

    const details = [
        { label: "Charges for Priority Discharge", amount: priorityDischargeCharge },
        { label: "Hospital Bill Amount Estimate", amount: approxEstimate },
        { label: "Total Amount to be blocked", amount: totalAmount }
    ];

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="space-y-4">
                {details.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">{item.label}</span>
                        <span className={`font-bold ${item.label === "Total Amount to be blocked" ? "text-blue-600 text-base" : "text-gray-900"}`}>
                            ₹{item.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}