"use client";
import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { ChevronLeft, UserRound } from "lucide-react";
import HorizontalStepper from "./HorizontalStepper";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const STEP_LABELS = [
  "Patient", "Insured", "Address", "Identity", "Banking", "Policy", "Review"
];

export default function FillDetailsLayout({ step, onBack, onNext, children }) {
  const router = useRouter();
  const docStatus = useSelector((state) => state.details.docStatus);
  const patientData = useSelector((state) => state.details.patient);
  const identityData = useSelector((state) => state.details.identity);
  const bankError = useSelector((state) => state.details.bankError);
  const bankingData = useSelector((state) => state.details.banking);
  const policyData = useSelector((state) => state.details.policy);


  const handleBackNavigation = () => {
    if (step === 1) {
      router.back();
    } else {
      onBack();
    }
  };

  const isPreviewPage = step === 7;
  const isReadOnly = docStatus === 1;

  const isValidEmail = (email) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!patientData.fullName?.trim();
      case 4: {
        const email = identityData?.email?.trim() || "";
        const m = identityData?.mobileNumber || "";
        const e1 = identityData?.emergencyNumber1 || "";
        const e2 = identityData?.emergencyNumber2 || "";
        
        const isEmailOk = email && isValidEmail(email);
        const isMOk = m.length === 10;
        const isE1Ok = !e1 || (e1.length === 10 && e1 !== m);
        const isE2Ok = !e2 || (e2.length === 10 && e2 !== m && e2 !== e1);

        return isEmailOk && isMOk && isE1Ok && isE2Ok;
      }
      case 5: return !bankError && !!bankingData.bankName?.trim(); 
      case 6: {
        const email = policyData?.registeredEmail?.trim();
        if (email) return isValidEmail(email);
        return true;
      }
      default: return true;
    }
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="bg-white px-4 pt-12 pb-3 grid grid-cols-3 items-center sticky top-0 z-50 shadow-[0_1px_0_0_#f1f5f9]">
        <div className="flex justify-start ml-4">
          <Button
            isIconOnly
            variant="light"
            onPress={handleBackNavigation}
            className="min-w-0 w-10 h-10 -ml-2"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-[17px] font-bold text-gray-900 whitespace-nowrap">
            {isPreviewPage ? "Review" : STEP_LABELS[step - 1]}
          </h1>
          {!isPreviewPage && (
            <span className="text-[11px] text-gray-400 font-medium">{step} of 6</span>
          )}
        </div>

        <div />
      </div>

      {/* Progress bar */}
      {!isPreviewPage && (
        <div className="h-[3px] bg-gray-100">
          <div
            className="h-full bg-[#1DA1FA] transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 6) * 100}%` }}
          />
        </div>
      )}
      <div className="p-6 flex-grow pb-32">
        <Card className="shadow-none border border-gray-100 rounded-[32px] overflow-visible bg-white">
          <CardBody className="p-6 gap-6">
            {!isPreviewPage && <HorizontalStepper currentStep={step} />}

            {isReadOnly && (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <UserRound size={18} className="text-[#1DA1FA]" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[#1DA1FA] text-[13px] font-bold">
                    View Screen Only
                  </p>
                  <p className="text-blue-600/70 text-[11px] font-medium">
                    This SSR is submitted and cannot be edited.
                  </p>
                </div>
              </div>
            )}
            <div className={`${!isPreviewPage ? 'mt-2' : ''} animate-in fade-in slide-in-from-right-4 duration-300`}>
              {children}
            </div>
          </CardBody>
        </Card>
      </div>

      {!isPreviewPage && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50 flex justify-center">
          <Button
            onPress={onNext}
            isDisabled={!isStepValid()}
            className={`w-full max-w-md font-bold h-14 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform ${isStepValid()
              ? "bg-[#1DA1FA] text-white"
              : "bg-gray-100 text-gray-400 shadow-none"
              }`}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}