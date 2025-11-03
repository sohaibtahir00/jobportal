import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
