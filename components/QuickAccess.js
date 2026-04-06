import NewRequest from '@/public/newrequest1.svg';
import Image from 'next/image';
import RequestSummary from "@/public/requestsummary1.svg";
import archivedrequest from "@/public/arcchivedrequest1.svg";
import Link from 'next/link';

const menuItems = [
  { id: 1, label: "New Request", icon: NewRequest, w: 95, h: 85, href: '/scanner' },
  { id: 2, label: "Request Summary", icon: RequestSummary, w: 0, h: 95, href: '' },
  { id: 3, label: "Archived Request", icon: archivedrequest, w: 105, h: 105, href: '' },
];

export default function QuickAccess() {
  return (
    <div className="mb-8 px-1"> 
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Access</h2>

      <div className="flex items-center justify-between">
        {menuItems.map((item, index) => (
          <Link 
            href={item.href} 
            key={index} 
            className="flex flex-col items-center" 
          >
            <div className="h-20 flex items-center justify-center mb-1">
              <Image
                src={item.icon}
                alt={item.label}
                width={item.w}
                height={item.h}
                className="object-contain"
              />
            </div>
            <span className="text-[12px] font-roboto font-medium text-gray-700 text-center whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}