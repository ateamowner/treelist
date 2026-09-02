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
    // 404 reuses this default. Real pages set their own title.
    default: `Page not found | ${site.name}`,
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
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <span
          hidden
          dangerouslySetInnerHTML={{
            __html: "<!-- Bing Webmaster (msvalidate.01): Anthony must add https://treelist.ai (not treelists.com) in Bing Webmaster Tools and paste the real content value. Do not invent a verification code. Google: homepage already has google-site-verification; paste a replacement only if Search Console issues one. -->",
          }}
        />
        <style>{`:root { ${themeVars}; }`}</style>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
