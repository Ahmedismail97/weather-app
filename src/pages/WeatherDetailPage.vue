<script setup lang="ts">
import {onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useWeatherStore } from '@/stores/weather';
import { ArrowLeft, Plus, Trash2 } from 'lucide-vue-next';
import WeatherIcon from '@/components/atoms/WeatherIcon.vue';
import HourlyForecast from '@/components/organisms/HourlyForecast.vue';
import WeeklyForecast from '@/components/organisms/WeeklyForecast.vue';

const router = useRouter();
const route = useRoute();
const weatherStore = useWeatherStore();
const locationId = route.params.id as string;
const isFromSearch = route.query.fromSearch === 'true';

const isInSavedList = computed(() => {
  return weatherStore.savedLocations.some(loc => loc.id === locationId);
});

onMounted(async () => {
  await weatherStore.loadLocationById(locationId);
  if (weatherStore.currentLocation) {
    await weatherStore.fetchWeatherData();
  }
});

function handleBack() {
  router.push('/');
}

function handleAdd() {
  if (weatherStore.currentLocation) {
    weatherStore.addToSavedLocations(weatherStore.currentLocation);
    router.push('/');
  }
}

function handleDelete() {
  weatherStore.removeFromSavedLocations(locationId);
  router.push('/');
}
</script>

<template>
  <div 
    class="weather-detail"
    :class="{ 'is-loading': weatherStore.isLoading }"
  >
    <header class="header">
      <button class="back-button" @click="handleBack">
        <ArrowLeft :size="24" />
      </button>
      <div class="location-info">
        <h1 class="location-name">
          {{ weatherStore.currentLocation?.name }}, 
          {{ weatherStore.currentLocation?.country }}
        </h1>
        <div class="date" v-if="weatherStore.currentLocation?.lastWeather?.date">
          {{ weatherStore.currentLocation.lastWeather.date }}
        </div>
      </div>
      <button 
        v-if="isFromSearch && !isInSavedList"
        class="action-button" 
        @click="handleAdd"
      >
        <Plus :size="24" />
      </button>
      <button 
        v-else-if="isInSavedList"
        class="action-button" 
        @click="handleDelete"
      >
        <Trash2 :size="24" />
      </button>
    </header>

    <div v-if="weatherStore.isLoading" class="loading">
      Loading...
    </div>

    <div v-else-if="weatherStore.error" class="error">
      {{ weatherStore.error }}
    </div>

    <template v-else-if="weatherStore.currentLocation?.lastWeather">
      <div class="current-weather">
        <WeatherIcon 
          :condition="weatherStore.currentLocation.lastWeather.condition"
          size="large"
          class="weather-icon"
        />
        <div class="temperature">{{ weatherStore.currentLocation.lastWeather.temp }}°</div>
        <div class="condition">{{ weatherStore.currentLocation.lastWeather.condition }}</div>
        <div class="high-low">
          H:{{ weatherStore.currentLocation.lastWeather.high }}° L:{{ weatherStore.currentLocation.lastWeather.low }}°
        </div>
      </div>

      <div class="weather-details">
        <div class="detail-item">
          <span class="label">Feels like</span>
          <span class="value">{{ weatherStore.currentLocation.lastWeather.feels_like }}°</span>
        </div>
        <div class="detail-item">
          <span class="label">Humidity</span>
          <span class="value">{{ weatherStore.currentLocation.lastWeather.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="label">Wind</span>
          <span class="value">{{ weatherStore.currentLocation.lastWeather.wind_speed }} km/h</span>
        </div>
        <div class="detail-item">
          <span class="label">UV Index</span>
          <span class="value">{{ weatherStore.currentLocation.lastWeather.uvi }}</span>
        </div>
      </div>

      <HourlyForecast 
        v-if="weatherStore.hourlyForecast.length"
        :forecast="weatherStore.hourlyForecast"
      />

      <WeeklyForecast
        v-if="weatherStore.dailyForecast.length"
        :forecast="weatherStore.dailyForecast"
      />
    </template>
  </div>
</template>

<style scoped>
.weather-detail {
  min-height: 100vh;
  padding: 20px;
  color: white;
  background: linear-gradient(180deg, #2C3E50 0%, #3498DB 100%);
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-button,
.action-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.back-button:hover,
.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.location-info {
  flex: 1;
  text-align: center;
}

.location-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.date {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 4px;
}

.current-weather {
  text-align: center;
  margin-bottom: 32px;
}

.weather-icon {
  margin-bottom: 16px;
}

.temperature {
  font-size: 64px;
  font-weight: 500;
  margin-bottom: 8px;
}

.condition {
  font-size: 20px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.high-low {
  font-size: 16px;
  opacity: 0.8;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin-bottom: 32px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 14px;
  opacity: 0.8;
}

.value {
  font-size: 16px;
  font-weight: 500;
}

.loading,
.error {
  text-align: center;
  padding: 32px;
  font-size: 16px;
  opacity: 0.8;
}
</style>