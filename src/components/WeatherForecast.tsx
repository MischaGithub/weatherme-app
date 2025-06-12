import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";
import Image from "next/image";
import type { ForecastData } from "@/lib/types";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  // Group forecast by day and get daily min/max
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      // Update min/max temps if needed
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  // Get next 5 days
  const nextDays = Object.values(dailyForecasts).slice(1, 6);

  // Format temperature
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 ">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="w-full lg:w-[calc(20%-0.8rem)] rounded-lg p-8 flex flex-col gap-4 bg-gradient-to-b from-[#B132E0] to-[#1E1E1E]"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {day.weather.description}
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <span className="flex items-center gap-1">
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather.icon}@4x.png`}
                    alt={day.weather.description}
                    className="h-full w-full object-contain"
                  />
                </span>
              </div>

              <div className="flex justify-center gap-2">
                <p className="font-medium">{formatTemp(day.temp_max)}C</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
