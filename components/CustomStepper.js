import { Button } from "@heroui/react";
import { Check } from "lucide-react";



const steps = [
  { label: "Case Initiated", status: "complete" },
  { label: "Document Verification", status: "active" },
  { label: "Hospital Verification", status: "active" },
  { label: "Payment Verification", status: "active" },
];

export default function CustomStepper() {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="relative flex w-full justify-between">
        
        <div className="absolute top-[16px] left-[12.5%] w-[75%] h-[2px] bg-white/30 z-0" />
        
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10 w-1/4 group">
            
            <div className="h-8 flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-colors
                ${step.status === 'complete' ? 'bg-white text-[#0095DA]' : 'bg-[#0095DA] text-white'}`}>
                {step.status === 'complete' ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                )}
              </div>
            </div>

            <p className="text-[10px] text-white text-center font-bold mt-2 px-1 leading-tight uppercase tracking-tight">
              {step.label}
            </p>
          </div>
        ))}
      </div>

      <Button className="bg-white text-[#0095DA] font-bold px-10 rounded-full shadow-lg h-12">
        Verify Details
      </Button>
    </div>
  );
}