import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import AppShell from "./sharedComponents/AppShell";

const nunito = Nunito({
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tesfa",
  description: "Ask Tesfa AI about conflicts, risk and their health consequences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
