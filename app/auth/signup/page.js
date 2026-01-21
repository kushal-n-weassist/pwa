"use client";
import SignupForm from "@/features/auth/signup/components/SignupForm";
import AuthLayout from "@/features/auth/AuthLayout";

export default function SignupPage() {
    return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
