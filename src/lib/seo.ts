import { Metadata, Viewport } from "next";

const BASE_URL = process.env.AUTH_URL || "https://raycast.app";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title = "Raycast - Canva Pro Membership",
  description = "แพลตฟอร์มสำหรับซื้อขาย Canva Pro ด้วยราคาที่เข้าถึงได้",
  image = "/og-image.png",
  keywords = ["Canva Pro", "subscription", "membership"],
  canonical,
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  const fullCanonical = canonical || BASE_URL;

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    alternates: canonical ? {
      canonical: fullCanonical,
    } : undefined,
    openGraph: {
      type: "website",
      locale: "th_TH",
      url: fullCanonical,
      siteName: "Raycast",
      title,
      description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImage],
      creator: "@raycast",
    },
    robots: {
      index: noIndex ? false : true,
      follow: true,
      googleBot: {
        index: noIndex ? false : true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    metadataBase: new URL(BASE_URL),
  };
}

export const viewportDefaults: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
