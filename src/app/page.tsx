import { WeatherDashboard } from "./pages/WeatherDashboard";

export default function Home() {
  return (
    <div className=" bg-gradient-to-br from-background to-muted">
      <main className="min-h-screen container mx-auto px-4 py-8">
        <WeatherDashboard />
      </main>
    </div>
  );
}
