import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import QueryProvider from "../components/providers/QueryProvider";
import { ThemeProvider } from "../context/theme-provider";
import { Layout } from "@/components/Layout";
import { Toaster } from "sonner";
import "./globals.css";

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
            <Layout>{children}</Layout>
            <Toaster richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
