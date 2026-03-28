import "./globals.css";
import { Roboto } from "next/font/google";
import Providers from "./Provider";
import InstallPrompt from "@/components/InstallPrompt";
import NetworkStatus from "@/components/NetworkStatus";
import SplashScreen from "@/components/SplashScreen";
import { GoogleOAuthProvider } from "@react-oauth/google";


const roboto = Roboto({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata = {
  applicationName: 'Fusion',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fusion',
  },
}


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-roboto font-light antialiased`}>
        <Providers>
          <SplashScreen />
          <NetworkStatus />
          <main className="light text-foreground bg-background">
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "placeholder"}>
              {children}
            </GoogleOAuthProvider>
          </main>
          <InstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
