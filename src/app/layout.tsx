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
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Sanchita Chamberlain",
    description:
      "Staff Product Designer at IBM (ex-HashiCorp). Infrastructure design that ships.",
    url: "https://sanchitachamberlain.com",
    siteName: "Sanchita Chamberlain",
    type: "website",
    images: [{ url: "/favicon.png", width: 512, height: 512, alt: "Sanchita Chamberlain" }],
  },
  twitter: {
    card: "summary",
    title: "Sanchita Chamberlain",
    description:
      "Staff Product Designer. Infrastructure design that ships.",
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
      className={`${dmMono.variable} ${dmSerif.variable} ${bebas.variable} h-full`}
    >
      <head>
        {/* Prevent dark-mode flash — reads localStorage before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();`,
          }}
        />
        {/* Preload wave image so it's ready before rubber-band overscroll occurs */}
        <link rel="preload" href="/magnific_rlhoJlkxtc.png" as="image" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Wave background — position:fixed keeps it stationary during rubber-band overscroll.
            page-wrapper's solid bg covers this during normal scroll; when page content
            translates during overscroll the wave becomes visible. */}
        <div aria-hidden="true" className="wave-bg" />
        <div className="page-wrapper">{children}</div>
      </body>
    </html>
  );
}
