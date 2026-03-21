"use client";
import { Input } from "@heroui/react";
import { useSelector } from "react-redux";

export default function MedicalInfoStep() {
    const details = useSelector((state) => state.details);
    const policy = details.policy || {};

    const selectStyles = {
        label: "hidden",
        trigger: "heroui-select-custom",
        value: "heroui-select-value",
        popoverContent: "bg-white border border-gray-100 shadow-lg rounded-[12px] p-1",
        innerWrapper: "flex items-center justify-between h-full",
        selectorIcon: "text-gray-400 w-4 h-4 static",
    };

    const inputStyles = {
        label: "hidden",
        inputWrapper: "heroui-input-custom",
        input: "heroui-input-field",
        innerWrapper: "h-full flex items-center py-0"
    };

    const fields = [
        { label: "Doctor", value: details.doctor || "N/A" },
        { label: "IP Number", value: details.ip_number || "N/A" },
        { label: "Date of Admission", value: details.date_of_admission || "N/A" },
        { label: "RTA/MLC", value: details.rta_mlc || "N/A" },
        { label: "Treatment Type", value: details.treatment_type || "N/A" },
        { label: "Room Type Opted", value: details.room_type_opted || "N/A" },
        { label: "Laser/Implant Cost", value: details.laser_implant_cost || "0" },
        { label: "Room Charges Opted", value: details.room_charges_opted || "0" },
        { label: "Approx Estimate", value: details.approx_estimate || "0" },
        { label: "ICU Charges Opted", value: details.icu_charges_opted || "0" },
        { label: "Risk", value: details.risk || "Low" },
    ];

    const CustomLabel = ({ children }) => (
        <label className="text-[13px] font-bold text-gray-900 mb-1 block">
            {children}
        </label>
    );

    return (
        <div className="flex flex-col gap-4 mb-2">
            {fields.map((f, i) => (
                <div key={i}>
                    <CustomLabel>{f.label}</CustomLabel>
                    <Input
                        isReadOnly
                        value={String(f.value)}
                        labelPlacement="outside"
                        variant="bordered"
                       classNames={inputStyles}
                    />
                </div>
            ))}
        </div>
    );
}