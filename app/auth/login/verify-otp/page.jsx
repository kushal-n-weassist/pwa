import { Suspense } from "react";
import VerifyOtpContent from "@/features/verify-otp/components/VerifyOtpContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
