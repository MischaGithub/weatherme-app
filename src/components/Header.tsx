"use client";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 ">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={"/"}>
          <div className="flex flex-row items-center">
            <Image
              src={"/WeatherIcon.gif"}
              alt="Weather GIF"
              className="h-14 rounded-full"
              width={56}
              height={56}
            />

            <span className="text-5xl font-bold">WeatherMe</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
