import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Living in Union County NC | Mike Wenger",
    template: "%s | Living in Union County NC",
  },
  description:
    "Your guide to moving to Union County, NC — neighborhoods, schools, homes for sale, and local resources.",
  keywords: ["Union County NC", "Waxhaw", "Indian Trail", "Monroe NC", "moving to Charlotte", "real estate"],
  openGraph: {
    siteName: "Living in Union County NC",
    url: "https://livinginunioncounty.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
