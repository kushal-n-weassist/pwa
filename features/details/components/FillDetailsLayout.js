// src/features/details/FillDetailsLayout.js
"use client";
import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import HorizontalStepper from "./HorizontalStepper";

export default function FillDetailsLayout({ step, onBack, onNext, children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1 text-center mr-8">
          {step === 7 ? "Submit Request" : "Fill Details"}
        </h1>
      </div>

      {/* Main Content Card */}
      <div className="p-6 flex-grow pb-32">
        <Card className="shadow-sm border-none rounded-[32px] overflow-visible">
          <CardBody className="p-6 gap-6">
            <HorizontalStepper currentStep={step} />
            <div className="mt-2 animate-in fade-in slide-in-from-right-4 duration-300">
              {children}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50">
        <Button 
          onClick={onNext}
          className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}