import NewRequest from '@/public/newrequest.png';
import Image from 'next/image';
import RequestSummary from "@/public/requestsummary.png";
import archivedrequest from "@/public/archivedrequest.png";
import Link from 'next/link';

import { icons } from 'lucide-react';

const menuItems = [
  { id: 1, label: "New Request", icon: NewRequest, w: 80, h: 80, href: '/newrequest' },
  { id: 2, label: "Request Summary", icon: RequestSummary, w: 90, h: 90, href: '' },
  { id: 3, label: "Archived Request", icon: archivedrequest, w: 90, h: 90, href: '' },
];

export default function QuickAccess() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Access</h2>
      <div className="flex justify-between items-center gap-4 mt-3">
        {menuItems.map((item,index) => (
          <Link href={item.href} key={index}>
            <div key={item.id} className="flex flex-col items-center">
              <Image
                src={item.icon}
                alt={item.label}
                width={item.w}
                height={item.h}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}