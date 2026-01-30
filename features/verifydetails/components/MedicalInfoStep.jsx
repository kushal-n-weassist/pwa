"use client";

import { Input } from "@heroui/react";

const fields = [
    { label: "Doctor", placeholder: "XXXXXXXXXXXXXX" },
    { label: "IP Number", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Date of Admission", placeholder: "XXXXXXXXXXXXXX" },
    { label: "RTA/MLC", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Treatment Type", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Room Type Opted", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Laser/Implant Cost", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Room Charges Opted", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Approx Estimate", placeholder: "XXXXXXXXXXXXXX" },
    { label: "ICU Charges Opted", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Risk", placeholder: "Low" },
];

export default function MedicalInfoStep() {
    return (
        <div className="flex flex-col mb-2">
            {fields.map((f, i) => (
                <Input
                    key={i}
                    label={f.label}
                    placeholder={f.placeholder}
                    labelPlacement="outside-top"
                    variant="bordered"
                    classNames={{
                        label: "text-gray-900 font-bold text-[13px] ml-2 block",
                        inputWrapper: "border-gray-200 rounded-xl  bg-gray-50/30",
                        input: "text-gray-400 font-normal bg-white border border-gray-200 p-1 rounded-md"
                    }}
                />
            ))}
        </div>
    );
}