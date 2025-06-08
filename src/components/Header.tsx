"use client";
import Link from "next/link";
import Image from "next/image";
import { CitySearch } from "./CitySearch";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/context/theme-provider";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex flex-row items-center">
          <Link href={"/"}>
            <Image
              src={"/WeatherIcon.gif"}
              alt="Weather GIF"
              className="h-14 rounded-full"
              width={56}
              height={56}
            />
          </Link>
          <span className="text-5xl font-bold">WeatherMe</span>
        </div>
      </div>
    </header>
  );
}
