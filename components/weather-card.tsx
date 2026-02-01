'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherData, formatTemperature, formatTime, getWeatherIconUrl } from '@/lib/weather';
import { Cloud, Droplets, Wind, Gauge, Eye, Sunrise, Sunset } from 'lucide-react';
import Image from 'next/image';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const weather = data.weather[0];
  
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[2px] animate-fade-in">
      <div className="bg-background rounded-lg h-full">
        <CardContent className="p-6">
          {/* Location Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">{data.name}</h2>
              <p className="text-muted-foreground">{data.sys.country}</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {weather.main}
            </Badge>
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 animate-float">
                <Image
                  src={getWeatherIconUrl(weather.icon)}
                  alt={weather.description}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <div className="text-6xl font-bold">
                  {formatTemperature(data.main.temp)}
                </div>
                <p className="text-muted-foreground capitalize mt-1">
                  {weather.description}
                </p>
              </div>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <WeatherDetail
              icon={<Droplets className="w-5 h-5" />}
              label="Humidity"
              value={`${data.main.humidity}%`}
            />
            <WeatherDetail
              icon={<Wind className="w-5 h-5" />}
              label="Wind Speed"
              value={`${data.wind.speed} m/s`}
            />
            <WeatherDetail
              icon={<Gauge className="w-5 h-5" />}
              label="Pressure"
              value={`${data.main.pressure} hPa`}
            />
            <WeatherDetail
              icon={<Eye className="w-5 h-5" />}
              label="Feels Like"
              value={formatTemperature(data.main.feels_like)}
            />
            <WeatherDetail
              icon={<Sunrise className="w-5 h-5" />}
              label="Sunrise"
              value={formatTime(data.sys.sunrise)}
            />
            <WeatherDetail
              icon={<Sunset className="w-5 h-5" />}
              label="Sunset"
              value={formatTime(data.sys.sunset)}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

interface WeatherDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function WeatherDetail({ icon, label, value }: WeatherDetailProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
