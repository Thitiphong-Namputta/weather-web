'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastData, formatTemperature, formatDate, getWeatherIconUrl } from '@/lib/weather';
import Image from 'next/image';

interface ForecastCardProps {
  data: ForecastData;
}

export function ForecastCard({ data }: ForecastCardProps) {
  // Get one forecast per day (every 8th item since API returns 3-hour intervals)
  const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {dailyForecasts.map((forecast, index) => (
            <div
              key={forecast.dt}
              className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all hover:scale-105 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-sm font-medium mb-2">
                {formatDate(forecast.dt)}
              </p>
              <div className="relative w-16 h-16 my-2">
                <Image
                  src={getWeatherIconUrl(forecast.weather[0].icon)}
                  alt={forecast.weather[0].description}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-2xl font-bold">
                {formatTemperature(forecast.main.temp)}
              </p>
              <p className="text-xs text-muted-foreground capitalize mt-1">
                {forecast.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
