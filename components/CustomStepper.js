"use client";

import { useSelector } from "react-redux";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function CustomStepper() {
  const selectedSSRName = useSelector((state) => state.dashboard.selectedSSRName);
  const navigator = useRouter();

  const handleclick = () => {
    console.log("redirextion to verify details")
    navigator.push('/verifydetails');

  }
  const handleUpdate = () =>{
    navigator.push('/details')
  } 

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-center gap-2 bg-white/20 rounded-full px-6 py-2.5 border border-white/30">
        <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">SSR ID</span>
        {selectedSSRName ? (
          <span className="text-white font-bold text-sm">{selectedSSRName}</span>
        ) : (
          <span className="text-white/30 font-bold text-sm tracking-widest">— — — — —</span>
        )}
      </div>

      {selectedSSRName && (
        <div className="flex justify-between gap-x-3"> 
          <Button onPress={handleclick} className="bg-white text-[#0095DA] font-bold px-10 rounded-full shadow-lg h-12">
            Stages
          </Button>
          <Button onPress={handleUpdate} className="bg-white text-[#0095DA] font-bold px-10 rounded-full shadow-lg h-12">
            Update
          </Button>
        </div>
      )}
    </div>
  );
}