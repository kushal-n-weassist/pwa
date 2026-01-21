"use client";
import logo from "@/public/logo.png";
import LoginForm from "@/features/auth/login/components/LoginForm";
import AuthLayout from "@/features/auth/AuthLayout";

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
