// Next
import type { Metadata, Viewport } from "next";
// Font
import { Vazirmatn } from "next/font/google";
// CSS
import "./globals.css";
// Clerk
import { ClerkProvider } from "@/services/clerk/components/ClerkProvider";
// Theme
import { ThemeProvider } from "next-themes";
// ShadCn
import { Toaster } from "@/components/ui/sonner";

const vazirmatnSans = Vazirmatn({
    variable: "--font-vazirmatn-sans",
    subsets: ["arabic"],
});

export const metadata: Metadata = {
    icons: "/icons/favicon.ico",
    title: "صفحه اصلی | Landr",
    description:
        "شغل رویایی خود را با هوش مصنوعی زودتر به دست بیاورید. مصاحبه‌های شبیه‌سازی شده، تحلیل رزومه و آماده‌سازی فنی برای جستجوی شغلی موفق‌تر.",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: "#FFFFFF",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${vazirmatnSans.variable} antialiased font-sans`}
            >
                <Toaster />
                <ClerkProvider>
                    <ThemeProvider
                        attribute="class"
                        disableTransitionOnChange
                        enableColorScheme
                        defaultTheme="system"
                    >
                        {children}
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
