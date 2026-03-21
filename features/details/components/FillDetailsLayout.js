"use client";
import React from "react";
import { Card, CardBody, Button, user } from "@heroui/react";
import { ChevronLeft, UserRound } from "lucide-react";
import HorizontalStepper from "./HorizontalStepper";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function FillDetailsLayout({ step, onBack, onNext, children }) {
  const router = useRouter();
  const docStatus = useSelector((state) => state.details.docStatus);

  const handleBackNavigation = () => {
    if (step === 1) {
      router.back();
    } else {
      onBack();
    }
  };
  const isPreviewPage = step === 7;
  const isReadOnly = docStatus === 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="bg-white px-4 pt-12 pb-4 grid grid-cols-3 items-center sticky top-0 z-50">
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

        <h1 className="text-[18px] font-bold text-gray-900 text-center whitespace-nowrap">
          {isPreviewPage ? "Submit Request" : "Fill Details"}
        </h1>

        <div />
      </div>

      <div className={`p-6 flex-grow ${isPreviewPage ? 'pb-6' : 'pb-32'}`}>
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
                    Viewing Submitted Request
                  </p>
                  <p className="text-blue-600/70 text-[11px] font-medium">
                    This information is currently  available here for your reference.
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
            className="w-full max-w-md bg-[#1DA1FA] text-white font-bold h-14 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
