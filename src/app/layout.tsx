import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { ToastProvider } from "@/components/ui";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aiml-jobs.com"),
  title: {
    default: "AI/ML Job Portal - Find Top Tech Jobs in AI, ML & Data Science",
    template: "%s | AI/ML Job Portal",
  },
  description:
    "Discover cutting-edge AI, Machine Learning, and Data Science jobs. Connect with top tech companies hiring for ML Engineers, Data Scientists, and AI Researchers. Browse 1000+ opportunities.",
  keywords: [
    "AI jobs",
    "Machine Learning jobs",
    "Data Science careers",
    "ML Engineer positions",
    "AI Research jobs",
    "Tech jobs",
    "Remote AI jobs",
    "Healthcare IT jobs",
    "FinTech careers",
    "Cybersecurity jobs",
  ],
  authors: [{ name: "AI/ML Job Portal" }],
  creator: "AI/ML Job Portal",
  publisher: "AI/ML Job Portal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aiml-jobs.com",
    siteName: "AI/ML Job Portal",
    title: "AI/ML Job Portal - Find Top Tech Jobs in AI, ML & Data Science",
    description:
      "Discover cutting-edge AI, Machine Learning, and Data Science jobs. Connect with top tech companies hiring for ML Engineers, Data Scientists, and AI Researchers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI/ML Job Portal - Find Your Dream Tech Job",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI/ML Job Portal - Find Top Tech Jobs in AI, ML & Data Science",
    description:
      "Discover cutting-edge AI, Machine Learning, and Data Science jobs. Browse 1000+ opportunities at top tech companies.",
    images: ["/og-image.png"],
    creator: "@aiml_jobs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 pt-16">{children}</main>
                <Footer />
              </div>
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
