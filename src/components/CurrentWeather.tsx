"use client";
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData, GeocodingResponse } from "@/lib/types";
import Image from "next/image";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  // Format temperature
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  {locationName?.name}
                </h2>
                {locationName?.state && (
                  <Image
                    src={"/location_pin.svg"}
                    alt={"City Location"}
                    width={31}
                    height={31}
                    quality={100}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-l capitalize font-bold tracking-tighter pr-4">
                {format(new Date(data.dt * 1000), "MMM, dd EEE")}
              </p>
              <Image
                src={"/thermo.svg"}
                alt={"City Location"}
                width={31}
                height={31}
                quality={100}
              />
              <p className="text-7xl font-bold tracking-tighter">
                {formatTemp(temp)}C
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-sm text-muted-foreground">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Wind Speed</p>
                  <p className="text-sm text-muted-foreground">{speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground">
              Feels like {formatTemp(feels_like)}
            </p>
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-0 text-center">
                <p className="text-sm font-medium capitalize">
                  {currentWeather.description}
                </p>
                <div className="space-y-1 ">
                  <div className="flex gap-2 text-sm font-medium">
                    <span className="flex items-center gap-1 text-blue-500 pr-6">
                      <ArrowDown className="h-3 w-3" />
                      {formatTemp(temp_min)}
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <ArrowUp className="h-3 w-3" />
                      {formatTemp(temp_max)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
