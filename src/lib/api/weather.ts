// lib/weather-api.ts
import type {
  WeatherData,
  ForecastData,
  GeocodingResponse,
  Coordinates,
} from "@/lib/types"; // adjust the path based on your structure

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY!;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

class WeatherAPI {
  // Create a URL with the given endpoint and parameters
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_KEY,
      ...params,
    });

    return `${endpoint}?${searchParams.toString()}`;
  }

  // Fetch data from the API and handle errors
  private async fetchData<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.statusText}`);
    return res.json();
  }

  // Public methods to get weather data
  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createUrl(`${BASE_URL}/weather`, {
      lat,
      lon,
      units: "metric",
    });
    return this.fetchData<WeatherData>(url);
  }

  // Get weather forecast data
  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createUrl(`${BASE_URL}/forecast`, {
      lat,
      lon,
      units: "metric",
    });
    return this.fetchData<ForecastData>(url);
  }

  // Geocoding methods
  async reverseGeocode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${GEO_URL}/reverse`, {
      lat,
      lon,
      limit: 1,
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }

  // Search for locations by name
  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${GEO_URL}/direct`, {
      q: query,
      limit: 5,
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();
