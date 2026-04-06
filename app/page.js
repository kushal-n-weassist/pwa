import Image from "next/image";
import LoginPage from "./auth/login/page";
import InstallPrompt from "@/components/InstallPrompt";
import { redirect } from "next/navigation";

// export default function Home() {
//   return (
//     <div className="">
//       <LoginPage/>
//       <InstallPrompt />
//     </div>
//   );
// }


export default function Home() {
  redirect("/auth/login");
}