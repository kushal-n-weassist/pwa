import Image from "next/image";
import LoginPage from "./auth/login/page";
import InstallPrompt from "@/components/InstallPrompt";

export default function Home() {
  return (
    <div className="">
      <LoginPage/>
      <InstallPrompt />
    </div>
  );
}
