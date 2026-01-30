import "./globals.css";
import { Roboto } from "next/font/google";
import Providers from "./Provider";

const roboto = Roboto({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata = {
  title: "Fusion app",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-roboto font-light antialiased`}
      >
        <Providers>
          <main className="light text-foreground bg-background">
            {children}
          </main>
        </Providers>

      </body>
    </html >
  );
}
