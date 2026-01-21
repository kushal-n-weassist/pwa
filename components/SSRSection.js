// components/SSRSection.js
import ssr from '@/public/ssr.png';
import Image from "next/image";

export default function SSRSection() {
  const cards = ["06", "07", "08", "09"];

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-3">
        <h2 className="text-lg font-bold text-gray-800">SSR</h2>
        <span className="text-sm text-gray-400">See all</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((id) => (
          <div key={id} className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center  border-6 border-gray-100 ">
                <Image src={ssr} alt="ssr" width={100} height={1000}/>
            </div>
            <p className="text-[9px] text-gray-500 font-bold text-center">
              SSR-10-24-00<br/>{id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}