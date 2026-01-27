"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { Button, Input, Textarea } from "@heroui/react";

export default function ContactUs() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-sans">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between shadow-sm">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
        <div className="w-6" /> 
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Email</label>
          <div className="flex items-center gap-4 bg-[#F1F3F4] p-4 rounded-xl">
            <Mail size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">
              contact@weassist.co.in
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Phone</label>
          <div className="flex flex-col gap-3">
            {[
              "+91 799611 0003",
              "+91 799611 0006",
              "+91 968628 8715"
            ].map((num, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-[#F1F3F4] p-4 rounded-xl">
                <Phone size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600 font-medium">{num}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-2">
          <Input
            label="Name"
            variant="underlined"
            placeholder=" "
            labelPlacement="outside"
            className="flex-1"
          />
          <Input
            label="Email"
            variant="underlined"
            placeholder=" "
            labelPlacement="outside"
            className="flex-1"
          />
        </div>

        <div className="space-y-2 mt-2">
          <label className="text-sm font-bold text-gray-700">Message</label>
          <Textarea
            variant="flat"
            placeholder="Type your message here..."
            disableAnimation
            disableAutosize
            classNames={{
              inputWrapper: "bg-[#F1F3F4] rounded-2xl p-4 min-h-[150px]",
              input: "text-sm"
            }}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md">
        <Button 
          className="w-full bg-[#1DA1FA] text-white font-bold h-14 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
        >
          Submit Query
        </Button>
      </div>
    </div>
  );
}