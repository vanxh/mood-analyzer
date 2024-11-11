import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixel = Pixelify_Sans({
    subsets: ["latin"],
    variable: "--font-pixelify-sans",
});

export const metadata: Metadata = {
    title: "Feeling Sentiment",
    description: "A sentiment analysis tool for your mood",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${pixel.variable} font-sans`}>{children}</body>
        </html>
    );
}
