import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/config/site";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — tree service directory`,
    template: `%s`,
  },
  description: site.description,
  applicationName: site.name,
};

const themeVars = Object.entries({
  "--background": site.theme.background,
  "--foreground": site.theme.foreground,
  "--card": site.theme.card,
  "--card-foreground": site.theme.foreground,
  "--popover": site.theme.card,
  "--popover-foreground": site.theme.foreground,
  "--primary": site.theme.primary,
  "--primary-foreground": site.theme.primaryForeground,
  "--secondary": site.theme.muted,
  "--secondary-foreground": site.theme.foreground,
  "--muted": site.theme.muted,
  "--muted-foreground": site.theme.mutedForeground,
  "--accent": site.theme.accent,
  "--accent-foreground": site.theme.accentForeground,
  "--border": site.theme.border,
  "--input": site.theme.border,
  "--ring": site.theme.ring,
  "--destructive": "#8b1e1e",
})
  .map(([key, value]) => `${key}: ${value}`)
  .join("; ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        {/*
          Search verification placeholders — do not invent codes.
          Bing Webmaster (msvalidate.01): Anthony must add https://treelist.ai
          (not treelists.com) in Bing Webmaster Tools and paste the real
          content value. Google: homepage metadata.verification.google is live;
          paste a new google-site-verification value only if Search Console
          issues a replacement.
        */}
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <style>{`:root { ${themeVars}; }`}</style>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
