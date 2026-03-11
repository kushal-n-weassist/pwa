import NewRequest from '@/public/newrequest1.svg';
import Image from 'next/image';
import RequestSummary from "@/public/requestsummary1.svg";
import archivedrequest from "@/public/arcchivedrequest1.svg";
import Link from 'next/link';

const menuItems = [
  { id: 1, label: "New Request", icon: NewRequest, w: 80, h: 80, href: '/newrequest' },
  { id: 2, label: "Request Summary", icon: RequestSummary, w: 0, h: 80, href: '' },
  { id: 3, label: "Archived Request", icon: archivedrequest, w: 90, h: 90, href: '' },
];

export default function QuickAccess() {
  return (
    <div className="mb-8 ">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Access</h2>
      
  
        <div className="flex w-full items-center justify-stretch">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index} className="w-full">
            <div className="flex flex-col items-center">

              <div className="h-20 w-full flex items-center justify-center mb-1">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={item.w}
                  height={item.h}
                  className="object-contain" 
                />
              </div>
              <span className="text-[11px] font-roboto font-light text-gray-600 text-center leading-tight max-w-[80px]">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}