export interface WeatherLocation {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  lastWeather?: WeatherData;
}

export interface WeatherData {
  temp: number;
  condition: string;
  high: number;
  low: number;
  icon: string;
  timezone: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  uvi: number;
  location: {
    name: string;
    country: string;
  };
  date: string;
  lastUpdate: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  pop: number;
  condition: string;
  timezone: number;
}

export interface DailyForecast {
  day: string;
  condition: string;
  temp: number;
  min: number;
  max: number;
  icon: string;
  pop: number;
  description: string;
}