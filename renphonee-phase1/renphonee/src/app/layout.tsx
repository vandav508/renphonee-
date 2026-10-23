import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata = {
  title: "Renphonee — Jual Beli iPhone Lumajang",
  description: "iPhone original, second inter, dan iBox. COD Lumajang dan sekitarnya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} bg-white font-sans text-black antialiased`}>{children}</body>
    </html>
  );
}
