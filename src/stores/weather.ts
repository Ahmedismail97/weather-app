import { defineStore } from 'pinia';
import { ref, watch, onMounted } from 'vue';
import type { WeatherLocation, WeatherData, HourlyForecast, DailyForecast } from '@/types/weather';
import { weatherApi } from '@/services/api';

const SAVED_LOCATIONS_KEY = 'weatherApp_savedLocations';

export const useWeatherStore = defineStore('weather', () => {
  const currentLocation = ref<WeatherLocation | null>(null);
  const weatherData = ref<WeatherData | null>(null);
  const hourlyForecast = ref<HourlyForecast[]>([]);
  const dailyForecast = ref<DailyForecast[]>([]);
  const savedLocations = ref<WeatherLocation[]>(
    JSON.parse(localStorage.getItem(SAVED_LOCATIONS_KEY) || '[]')
  );
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  watch(savedLocations, (locations) => {
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(locations));
  }, { deep: true });

  async function searchLocations(query: string) {
    try {
      isLoading.value = true;
      error.value = null;
      return await weatherApi.searchLocations(query);
    } catch (e) {
      error.value = 'Failed to search locations';
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function searchLocationsByCoords(lat: number, lon: number) {
    try {
      isLoading.value = true;
      error.value = null;
      return await weatherApi.searchLocationsByCoords(lat, lon);
    } catch (e) {
      error.value = 'Failed to get location';
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function setCurrentLocation(location: WeatherLocation) {
    currentLocation.value = location;
  }

  async function fetchWeatherData() {
    if (!currentLocation.value) return;
    
    try {
      isLoading.value = true;
      const [weather, forecast] = await Promise.all([
        weatherApi.getCurrentWeather(
          currentLocation.value.lat,
          currentLocation.value.lon
        ),
        weatherApi.getForecast(
          currentLocation.value.lat,
          currentLocation.value.lon
        )
      ]);

      currentLocation.value.lastWeather = weather;
      hourlyForecast.value = forecast.hourly.filter(hour => new Date(Number(hour.time)).getTime() >= Date.now());
      dailyForecast.value = forecast.daily;
    } catch (e) {
      error.value = 'Failed to fetch weather data';
    } finally {
      isLoading.value = false;
    }
  }

  async function loadLocationById(id: string) {
    try {
      isLoading.value = true;
      error.value = null;

      const savedLocation = savedLocations.value.find(loc => loc.id === id);
      if (savedLocation) {
        await setCurrentLocation(savedLocation);
        return;
      }

      const [lat, lon] = id.split('-').map(Number);
      if (isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid location ID');
      }

      const locations = await weatherApi.searchLocationsByCoords(lat, lon);
      if (locations.length === 0) {
        throw new Error('Location not found');
      }

      await setCurrentLocation(locations[0]);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load location';
    } finally {
      isLoading.value = false;
    }
  }

  function addToSavedLocations(location: WeatherLocation) {
    if (!savedLocations.value.some(loc => loc.id === location.id)) {
      savedLocations.value.push(location);
    }
  }

  function removeFromSavedLocations(locationId: string) {
    savedLocations.value = savedLocations.value.filter(loc => loc.id !== locationId);
  }

  async function refreshAllLocations() {
    try {
      await Promise.all(
        savedLocations.value.map(async (location) => {
          const weather = await weatherApi.getCurrentWeather(location.lat, location.lon);
          location.lastWeather = weather;
        })
      );
    } catch (e) {
      error.value = 'Failed to refresh locations';
    }
  }


  onMounted(async () => {
    if (savedLocations.value.length > 0) {
      await refreshAllLocations();
    }
  });

  return {
    currentLocation,
    weatherData,
    hourlyForecast,
    dailyForecast,
    savedLocations,
    isLoading,
    error,
    searchLocations,
    searchLocationsByCoords,
    setCurrentLocation,
    fetchWeatherData,
    loadLocationById,
    addToSavedLocations,
    removeFromSavedLocations,
    refreshAllLocations
  };
});