"use client";

import React, { useState } from "react";
import FillDetailsLayout from "@/features/details/components/FillDetailsLayout";
import PatientDetails from "@/features/details/components/PatientDetails";
import InsuredDetails from "@/features/details/components/InsuredDetails";
import AddressDetails from "@/features/details/components/AddressDetails";
import IdentityContact from "@/features/details/components/IdentityContact";
import BankingDetails from "@/features/details/components/BankingDetails";
import PolicyDetails from "@/features/details/components/PolicyDetails";
import SubmitRequest from "@/features/details/components/SubmitRequest";

export default function FillDetailsPage() {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 7));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1: return <PatientDetails />;
      case 2: return <InsuredDetails />;
      case 3: return <AddressDetails />;
      case 4: return <IdentityContact />;
      case 5: return <BankingDetails />;
      case 6: return <PolicyDetails />;
      case 7: return <SubmitRequest />;
      default: return <PatientDetails />;
    }
  };

  return (
    <FillDetailsLayout step={step} onNext={handleNext} onBack={handleBack}>
      {renderStep()}
    </FillDetailsLayout>
  );
}