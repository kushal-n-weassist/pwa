import { Input, Textarea } from "@heroui/react";

const healthFields = [
    { label: "Diabetes", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Alcohol", placeholder: "XXXXXXXXXXXXXX" },
    { label: "HTN", placeholder: "XXXXXXXXXXXXXX" },
    { label: "Smoking/Drug Abuse", placeholder: "XXXXXXXXXXXXXX" },
];

export default function HealthConditionsStep() {
    return (
        <div className="flex flex-col gap-5 h-full pb-10">
            {healthFields.map((f, i) => (
                <Input
                    key={i}
                    label={f.label}
                    placeholder={f.placeholder}
                    labelPlacement="outside-top"
                    variant="bordered"
                    classNames={{
                        label: "text-gray-900 font-bold text-[13px] ml-2",
                        inputWrapper: "border-gray-200 rounded-xl h-12 bg-gray-50/30",
                        input: "text-gray-900 bg-white border border-gray-200 rounded-md p-1 font-normal outline-none"
                    }}
                />
            ))}

            <div className="mt-2">
                <Textarea
                    label="Other Health Condition"
                    placeholder=""
                    labelPlacement="outside"
                    variant="flat"
                    minRows={4}
                    classNames={{
                        label: "text-gray-900 font-bold text-[13px] mb-2 block",
                        inputWrapper: `bg-[#EDEDED] rounded-xl border-none h-full focus-within:outline-none
                                focus-within:ring-0 focus-within:ring-offset-0 focus-within:shadow-none`,
                        input: `     text-gray-900 font-normal text-base h-full w-full outline-none focus:outline-none resize-none overflow-y-auto `
                    }}
                />
                <p className="text-[11px] text-[#8E8EA0] mt-1 ml-1 font-normal">
                    Heart/Kidney/Liver/Arthritis/Neuro
                </p>
            </div>

            <Textarea
                label="Any Other ailment"
                placeholder=""
                labelPlacement="outside"
                variant="flat"
                minRows={4}
                classNames={{
                    label: "text-gray-900 font-bold text-[13px] mb-2 block",
                    inputWrapper: `bg-[#EDEDED] rounded-xl border-none h-full focus-within:outline-none
                                focus-within:ring-0 focus-within:ring-offset-0 focus-within:shadow-none`,
                    input: `     text-gray-900 font-normal text-base h-full w-full outline-none focus:outline-none resize-none overflow-y-auto mb-5`
                }}
            />
        </div>
    );
}