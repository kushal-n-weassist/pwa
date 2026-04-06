

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useRequireScanner() {
  const router = useRouter();
  const hospital   = useSelector((state) => state.details.hospital);
  const claimType  = useSelector((state) => state.details.claimType);
  const city       = useSelector((state) => state.details.city);

  useEffect(() => {
    if (!hospital || !claimType || !city) {
      toast.error("Please scan the hospital QR code first.", {
        id: "require-scanner", 
        duration: 4000,
        style: {
          borderRadius: "20px",
          background: "#fff",
          color: "#333",
          fontSize: "14px",
          fontWeight: "bold",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        },
        
      });
      router.replace("/scanner");
    }
  }, [hospital, claimType, city, router]);

  return { hospital, claimType, city };
}
