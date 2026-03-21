import "./globals.css";
import { Roboto } from "next/font/google";
import Providers from "./Provider";
import InstallPrompt from "@/components/InstallPrompt";

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
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
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
          <main className="light text-foreground bg-background">
            {children}
          </main>
          <InstallPrompt />  
        </Providers>
      </body>
    </html>
  );
}
