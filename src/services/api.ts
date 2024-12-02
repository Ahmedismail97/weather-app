import axios from 'axios';
import type { WeatherLocation, WeatherData, HourlyForecast, DailyForecast } from '@/types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherApi = {
  async searchLocations(query: string): Promise<WeatherLocation[]> {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    return response.data.map((location: any) => ({
      id: `${location.lat}-${location.lon}`,
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon
    }));
  },

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    const locationDate = new Date(Date.now() + (response.data.timezone * 1000));
    
    return {
      temp: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      high: Math.round(response.data.main.temp_max),
      low: Math.round(response.data.main.temp_min),
      icon: response.data.weather[0].icon,
      timezone: response.data.timezone,
      feels_like: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      wind_speed: response.data.wind.speed,
      description: response.data.weather[0].description,
      uvi: 0,
      location: {
        name: response.data.name,
        country: response.data.sys.country
      },
      date: locationDate.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      lastUpdate: locationDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  },

  async getForecast(lat: number, lon: number): Promise<{
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  }> {
    const currentWeather = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const timezoneOffset = currentWeather.data.timezone;

    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const now = new Date();
    const cityTime = new Date(now.getTime() + (timezoneOffset * 1000));
    const currentHour = cityTime.getUTCHours();
    
    const hourly = Array.from({ length: 24 }, (_, index) => {
      const forecastTime = new Date(cityTime);
      forecastTime.setUTCHours(currentHour + index);
      
      const matchingForecast = response.data.list.find((item: any) => {
        const itemTime = new Date(item.dt * 1000);
        return Math.abs(itemTime.getTime() - forecastTime.getTime()) < 3 * 3600 * 1000;
      }) || response.data.list[0];

      return {
        time: forecastTime.getTime().toString(),
        temp: Math.round(matchingForecast.main.temp),
        icon: matchingForecast.weather[0].icon,
        pop: matchingForecast.pop || 0,
        condition: matchingForecast.weather[0].main,
        timezone: timezoneOffset
      };
    });

    const daily = response.data.list
      .filter((_: any, index: number) => index % 8 === 0)
      .slice(0, 7)
      .map((item: any) => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
        condition: item.weather[0].main,
        temp: Math.round(item.main.temp),
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max),
        icon: item.weather[0].icon,
        pop: Math.round(item.pop * 100),
        description: item.weather[0].description
      }));

    return { hourly, daily };
  },

  async searchLocationsByCoords(lat: number, lon: number): Promise<WeatherLocation[]> {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    return response.data.map((location: any) => ({
      id: `${location.lat}-${location.lon}`,
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon
    }));
  }
};