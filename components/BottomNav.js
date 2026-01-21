
import { Home, ScanQrCode, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-6 left-6 right-6 bg-[#007AB8] rounded-full h-16 flex items-center justify-around px-6 shadow-2xl z-50">
      <div className="flex flex-col items-center text-white">
        <Home size={22} />
        <span className="text-[10px]">Home</span>
      </div>
      <div className="flex flex-col items-center text-white/70">
        <ScanQrCode size={22} />
        <span className="text-[10px]">Scan QR</span>
      </div>
      <div className="flex flex-col items-center text-white/70">
        <User size={22} />
        <span className="text-[10px]">Profile</span>
      </div>
    </div>
  );
}