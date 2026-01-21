"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      <motion.div
        initial={{ y: 0, scale: 1 }}
        animate={{ y: -240, scale: 0.9 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center justify-center h-screen z-10"
      >
        <Image src={logo} width={190} height={120} alt="Logo" />
      </motion.div>

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        className="absolute bottom-0 w-full h-[65vh]"
      >
        {children}
      </motion.div>

    </div>
  );
}
