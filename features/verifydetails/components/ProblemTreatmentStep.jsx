import { Textarea } from "@heroui/react";

export default function ProblemTreatmentStep() {
    return (
        <div className="flex flex-col gap-6">
            <Textarea
                label="Presented Problem"
                labelPlacement="outside"
                variant="flat"
                classNames={{
                    label: "text-gray-900 font-bold text-[13px] mb-2 block",
                    inputWrapper: `bg-[#EDEDED] rounded-xl border-none h-full focus-within:outline-none
                                focus-within:ring-0 focus-within:ring-offset-0 focus-within:shadow-none`,
                    input: `     text-gray-900 font-normal text-base h-full w-full outline-none focus:outline-none resize-none overflow-y-auto `
                }}
            />

            <Textarea
                label="Line of Treatment"
                placeholder=""
                labelPlacement="outside"

                variant="flat"
                minRows={6}
                classNames={{
                    label: "text-gray-900 font-bold text-[13px] mb-2 block",
                    inputWrapper: `bg-[#EDEDED] rounded-xl border-none h-full focus-within:outline-none
                                focus-within:ring-0 focus-within:ring-offset-0 focus-within:shadow-none`,
                    input: `     text-gray-900 font-normal text-base h-full w-full outline-none focus:outline-none resize-none overflow-y-auto `
                }}
            />
        </div>
    );
} 