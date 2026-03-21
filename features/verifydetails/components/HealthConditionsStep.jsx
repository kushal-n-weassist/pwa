"use client";
import { Input, Textarea } from "@heroui/react";
import { useSelector } from "react-redux";

export default function HealthConditionsStep() {
    const details = useSelector((state) => state.details);

    const CustomLabel = ({ children }) => (
        <label className="text-[13px] font-bold text-gray-900 mb-1 block">
            {children}
        </label>
    );

    const inputStyles = {
        label: "hidden",
        inputWrapper: "heroui-input-custom",
        input: "heroui-input-field",
        innerWrapper: "h-full flex items-center py-0"
    };

    const healthFields = [
        { label: "Diabetes", value: details.diabetes || "NA" },
        { label: "Alcohol", value: details.alcohol || "No" },
        { label: "HTN", value: details.htn || "No" },
        { label: "Smoking/Drug Abuse", value: details.smokingdrug_abuse || "No" },
    ];

    return (
        <div className="flex flex-col gap-5 h-full pb-10">
            {healthFields.map((f, i) => (
            <div key={i}>
                <CustomLabel>{f.label}</CustomLabel>
                <Input
                    key={i}
                    isReadOnly
                    label={f.label}
                    value={f.value}
                    labelPlacement="outside"
                    variant="bordered"
                    classNames={inputStyles}
                />
                </div>
            ))}

            <div className="mt-2">
                <Textarea
                    isReadOnly
                    label="Other Health Condition"
                    value={details.other_health_conditions || "None"}
                    labelPlacement="outside"
                    variant="flat"
                    minRows={3}
                    classNames={{
                        label: "text-gray-900 font-bold text-[13px] mb-2",
                        inputWrapper: "bg-[#EDEDED] rounded-xl border-none shadow-none",
                        input: "text-gray-600 font-normal text-sm"
                    }}
                />
                <p className="text-[11px] text-[#8E8EA0] mt-1 ml-1 font-normal italic">
                    Heart / Kidney / Liver / Arthritis / Neuro
                </p>
            </div>

            <Textarea
                isReadOnly
                label="Any Other ailment"
                value={details.any_other_ailment || "N/A"}
                labelPlacement="outside"
                variant="flat"
                minRows={3}
                classNames={{
                    label: "text-gray-900 font-bold text-[13px] mb-2",
                    inputWrapper: "bg-[#EDEDED] rounded-xl border-none shadow-none",
                    input: "text-gray-600 font-normal text-sm"
                }}
            />
        </div>
    );
}