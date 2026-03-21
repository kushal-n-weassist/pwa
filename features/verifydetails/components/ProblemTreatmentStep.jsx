"use client";
import { Textarea } from "@heroui/react";
import { useSelector } from "react-redux";

export default function ProblemTreatmentStep() {
    const details = useSelector((state) => state.details);


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

    return (
        <div className="flex flex-col gap-6">
            <Textarea
                isReadOnly
                label="Presented Problem"
                value={details.presented_problem || "No problem details provided."}
                labelPlacement="outside"
                variant="flat"
                classNames={{
                    label: "text-gray-900 font-bold text-[13px] mb-2",
                    inputWrapper: "bg-[#EDEDED] rounded-xl border-none shadow-none",
                    input: "text-gray-600 font-normal text-sm"
                }}
            />

            <Textarea
                isReadOnly
                label="Line of Treatment"
                value={details.line_of_treatment || "N/A"}
                labelPlacement="outside"
                variant="flat"
                minRows={6}
                classNames={{
                    label: "text-gray-900 font-bold text-[13px] mb-2",
                    inputWrapper: "bg-[#EDEDED] rounded-xl border-none shadow-none",
                    input: "text-gray-600 font-normal text-sm"
                }}
            />
        </div>
    );
}