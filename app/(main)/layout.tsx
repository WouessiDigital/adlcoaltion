import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Header, JoinForm } from '../../components/index';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "African Diaspora Leaders Coalition",
  description: "Uniting African voices in Canada to shape policy, foster investment, and drive sustainable development across Africa.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Header />
        {children}  {/* ← ADD THIS - renders your page content */}
        <JoinForm/>
    </>
  );
}

