import type { Metadata } from "next";
import type { ReactNode } from "react";
import { themeConfig } from "@/config/theme.config";
import { AppProviders } from "@/providers/app-providers";
import "../globals.css";

export const metadata: Metadata = {
  title: themeConfig.brand.name,
  description: themeConfig.brand.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
