import type { Metadata } from "next";
import { DM_Mono, DM_Serif_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sanchita Chamberlain",
  description:
    "Staff Product Designer. I design the system around the product — the phasing, the architecture, the cross-functional alignment that makes it shippable.",
  openGraph: {
    title: "Sanchita Chamberlain",
    description:
      "Staff Product Designer at IBM (HashiCorp). Infrastructure design that ships.",
    url: "https://sanchitachamberlain.com",
    siteName: "Sanchita Chamberlain",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanchita Chamberlain",
    description:
      "Staff Product Designer. Infrastructure design that ships.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmMono.variable} ${dmSerif.variable} ${bebas.variable} h-full`}
    >
      {/* Prevent dark-mode flash — reads localStorage before first paint */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();`,
        }}
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
