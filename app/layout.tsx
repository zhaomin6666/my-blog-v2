import type { Metadata } from "next";
import localFont from "next/font/local";
import { SettingsProvider } from "@/lib/settings-context";
import { siteConfigService } from "@/lib/site-config";
import "./globals.css";

const geistSans = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await siteConfigService.getSiteConfig();

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    applicationName: siteConfig.siteName,
    title: {
      default: siteConfig.defaultTitle,
      template: `%s | ${siteConfig.siteName}`,
    },
    description: siteConfig.defaultDescription,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    openGraph: {
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
      url: siteConfig.siteUrl,
      siteName: siteConfig.siteName,
      locale: siteConfig.defaultLocale,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
      ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
