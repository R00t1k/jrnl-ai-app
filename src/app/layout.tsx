import "@/styles/globals.css";

import { type Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/server/auth";               // دالتك لجلب الجلسة (Server)
import { TRPCReactProvider } from "@/trpc/react";
import { Navigation } from "@/app/_components/Navigation";

export const metadata: Metadata = {
  title: "JRNL APP",
  description: "An AI Journal App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "800"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-montserrat",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // نحصل على الجلسة على الخادم
  const session = await auth(); // أو getServerSession(authOptions)

  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body>
        <SessionProvider session={session}>
          {/* ضَع TRPC داخل SessionProvider إذا كانت أي استعلامات تحتاج الجلسة */}
          <TRPCReactProvider>
            <Navigation />
            {children}
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
