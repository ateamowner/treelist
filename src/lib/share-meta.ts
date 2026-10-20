import type { Metadata } from "next";
import { site } from "@/config/site";

/** Default 1200x630 share card in /public. */
export const shareImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "TreeList tree service directory",
};

/**
 * Open Graph + Twitter tags for one page. Next.js does not copy the
 * <title> into og:title, and a page-level openGraph replaces the layout's,
 * so every indexable page passes its own title, description, and path.
 */
export function shareMeta(
  title: string,
  description: string,
  path: string
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage.url],
    },
  };
}
