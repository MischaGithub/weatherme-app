import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "../context/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/Header";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeatherMe App",
  description: "Weather details for your city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider defaultTheme="dark">
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
