// components/CustomStepper.js
import { Button } from "@heroui/react";
import { Check } from "lucide-react";

const steps = [
  { label: "Case Initiated", status: "active" },
  { label: "Document Verification", status: "complete" },
  { label: "Hospital Verification", status: "active" },
  { label: "Payment Verification", status: "complete" },
];

export default function CustomStepper() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center w-full justify-between relative px-2">
        <div className="absolute top-4 left-0 w-full h-[2px] bg-white/50 -z-0" />
        
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-2 z-10 w-1/4">
            <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center 
              ${step.status === 'complete' ? 'bg-white text-[#0095DA]' : 'bg-[#0095DA] text-white'}`}>
              {step.status === 'complete' ? <Check size={16} /> : <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <p className="text-[10px] text-white text-center font-medium leading-tight">
              {step.label}
            </p>
          </div>
        ))}
      </div>

      <Button className="bg-white text-[#0095DA] font-bold px-10 rounded-full shadow-lg">
        Verify Details
      </Button>
    </div>
  );
}