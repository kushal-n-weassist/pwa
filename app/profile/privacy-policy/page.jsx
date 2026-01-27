"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card, CardBody, ScrollShadow } from "@heroui/react";

export default function PrivacyPolicy() {
  const router = useRouter();

  const policyText = `
   We Assists (referred to as "we", "us", "Weassist") are the authors and publishers  of the website https://www.weassist.co.in     and its subdomains, if any (collectively referred to as "Websites") on the world wide web as well as providers of other software applications, including but not limited to    the Applications used for Hospital Information System, Customer Relationship Management, Appointments Management, Call Center / Contact Center, Mobile Applications (referred to as "App").
All such Apps, together with Websites, visited, accessed, or used by users are referred to as "Services". Weassist provides the Services, either on its own or in partnership with its agents, affiliates, associates, representatives, or third parties (together referred to as "Partners").
  `;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-sans">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <button onClick={() => router.back()} className="p-1 active:opacity-50">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
        <div className="w-6" /> 
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <Card className="bg-[#EAEAEA] border-none rounded-[20px] h-[75vh] shadow-none">
          <CardBody className="p-6">
            <ScrollShadow
              hideScrollBar={false}
              className="h-full w-full pr-2 text-gray-600 leading-relaxed text-[15px]"
            >
              <div className="whitespace-pre-line">
                {policyText}
                {"\n\n"}
                Your privacy is important to us. This policy outlines how we collect,
                use, and protect your personal information when using our Services.
                By accessing our Apps, you agree to the terms outlined in this
                Privacy Policy.
                {"\n\n"}
                We may update this policy from time to time. We encourage users to
                frequently check this page for any changes to stay informed about
                how we are helping to protect the personal information we collect.
              </div>
            </ScrollShadow>
          </CardBody>
        </Card>
      </div>

      <div className="h-8 bg-[#F8FAFC]" />
    </div>
  );
}