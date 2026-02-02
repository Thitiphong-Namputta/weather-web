'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { SearchBar } from '@/components/search-bar';
import { WeatherCard } from '@/components/weather-card';
import { ForecastCard } from '@/components/forecast-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherData, ForecastData, getCurrentWeatherByCoords, getForecastByCoords } from '@/lib/weather';
import { CloudOff, AlertCircle, MapPin } from 'lucide-react';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (!weatherRes.ok) {
        const errorData = await weatherRes.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      // Fetch forecast
      const forecastRes = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
      if (!forecastRes.ok) {
        const errorData = await forecastRes.json();
        throw new Error(errorData.error || 'Failed to fetch forecast data');
      }
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather for current location on mount
  useEffect(() => {
    const fetchCurrentLocationWeather = async () => {
      if (!navigator.geolocation) {
        setLocationLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLoading(true);
          try {
            const { latitude, longitude } = position.coords;
            
            const weatherData = await getCurrentWeatherByCoords(latitude, longitude);
            setWeather(weatherData);

            const forecastData = await getForecastByCoords(latitude, longitude);
            setForecast(forecastData);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather for your location');
          } finally {
            setLoading(false);
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationLoading(false);
        }
      );
    };

    fetchCurrentLocationWeather();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in">
              Weather Forecast
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-300 animate-fade-in">
              Get real-time weather information for any city worldwide
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} isLoading={loading} />

          {/* Loading State */}
          {loading && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-20" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-32" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="border-destructive/50 bg-destructive/10 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">Error</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weather Data */}
          {weather && forecast && !loading && (
            <div className="space-y-6">
              <WeatherCard data={weather} />
              <ForecastCard data={forecast} />
            </div>
          )}

          {/* Empty State */}
          {!weather && !loading && !error && (
            <Card className="border-dashed animate-fade-in">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                  {locationLoading ? (
                    <>
                      <MapPin className="w-16 h-16 mb-4 opacity-50 animate-pulse" />
                      <h3 className="text-xl font-semibold mb-2">Getting your location...</h3>
                      <p>We'll show weather for your current location</p>
                    </>
                  ) : (
                    <>
                      <CloudOff className="w-16 h-16 mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">No weather data</h3>
                      <p>Search for a city to see the weather forecast</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
