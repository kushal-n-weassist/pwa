import React from "react";
import { ChevronRight } from "lucide-react";
import ssr from '@/public/ssr.png';
import Image from "next/image";

export default function ServiceTile({ id, name, onClick }) {
  return (
    <div 
      className="flex bg-[#D4ECFF] rounded-[7px] shadow-sm overflow-hidden cursor-pointer transition-transform  h-18 active:scale-[0.99] w-full min-h-[60px] m-1"
      onClick={onClick}
    >

      <div className="flex flex-1 items-center p-2.5 pl-3">
        <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full p-1 shrink-0 border border-[#D9D9D9]">
          <Image src={ssr} alt="ssr" width={32} height={32}/>
        </div>

        <div className="flex flex-1 flex-col justify-center px-3 overflow-hidden">
          <h3 className="text-[10px] font-extrabold text-gray-900 leading-tight truncate">
            {id}
          </h3>
          <p className="text-[12px] text-[#2196F3] font-semibold mt-0.5 truncate">
            {name}
          </p>
        </div>
      </div>


      <div className="w-[24px] bg-[#2196F3] flex items-center justify-center text-white shrink-0">
        <ChevronRight size={16} strokeWidth={4} />
      </div>
    </div>
  );
}