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
  icons: { icon: '/favicon.png', shortcut: '/favicon.png' },
  description:
    "Product Designer. I design the system around the product — the phasing, the architecture, the cross-functional alignment that makes it shippable.",
  openGraph: {
    title: "Sanchita Chamberlain",
    description:
      "Product Designer at IBM (ex-HashiCorp). 12+ years in B2B SaaS, 9 in developer tools. Infrastructure design that ships.",
    url: "https://sanchitachamberlain.com",
    siteName: "Sanchita Chamberlain",
    type: "website",
    images: [{ url: "/favicon.png", width: 512, height: 512, alt: "Sanchita Chamberlain" }],
  },
  twitter: {
    card: "summary",
    title: "Sanchita Chamberlain",
    description:
      "Product Designer. 12+ years in B2B SaaS, 9 in developer tools. Infrastructure design that ships.",
    images: ["/favicon.png"],
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
      suppressHydrationWarning
      className={`${dmMono.variable} ${dmSerif.variable} ${bebas.variable}`}
    >
      <head>
        {/* Prevent dark-mode flash — reads localStorage before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();`,
          }}
        />
        {/* Preload overscroll background so it's ready before elastic scroll */}
        <link rel="preload" href="/magnific-waves-bg.jpg" as="image" />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
