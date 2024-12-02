<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { WeatherLocation, WeatherData } from '@/types/weather';
import { weatherApi } from '@/services/api';
import { weatherBackgrounds } from '@/assets/backgrounds';
import { useWeatherStore } from '@/stores/weather';
import { useRouter } from 'vue-router';

interface Props {
  location: WeatherLocation;
  isMyLocation?: boolean;
}

const props = defineProps<Props>();
const weather = ref<WeatherData | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const weatherStore = useWeatherStore();
const router = useRouter();

const cardStyle = computed(() => {
  if (!weather.value) return {};
  const condition = weather.value.condition as keyof typeof weatherBackgrounds;
  const gradient = weatherBackgrounds[condition] || weatherBackgrounds.default;
  return {
    background: gradient,
  };
});

onMounted(async () => {
  try {
    isLoading.value = true;
    weather.value = await weatherApi.getCurrentWeather(props.location.lat, props.location.lon);
  } catch (e) {
    error.value = 'Failed to load weather data';
  } finally {
    isLoading.value = false;
  }
});

function formatTime(timezone: number = 0) {
  const utcSeconds = Math.floor(Date.now() / 1000);
  const localSeconds = utcSeconds + timezone;
  const localTime = new Date(localSeconds * 1000);
  
  return localTime.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC'
  });
}

function handleCardClick() {
  router.push(`/weather/${props.location.id}`);
}
</script>

<template>
  <div 
    class="weather-card"
    :class="{ 
      'is-loading': isLoading,
      'my-location': isMyLocation 
    }"
    :style="cardStyle"
    @click="handleCardClick"
  >
    <div class="card-content">
      <div class="location-info">
        <div class="primary-info">
          <h2 class="location-name">
            {{ isMyLocation ? 'My Location' : location.name }}
          </h2>
          <p v-if="isMyLocation" class="sublocation">{{ location.name }}</p>
          <p class="time">{{ weather ? formatTime(weather.timezone) : '--:--' }}</p>
        </div>
        <p v-if="weather" class="weather-condition">{{ weather.condition }}</p>
      </div>

      <div v-if="weather" class="weather-info">
        <div class="temperature">{{ weather.temp }}°</div>
        <div class="high-low">
          H:{{ weather.high }}° L:{{ weather.low }}°
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  border-radius: 16px;
  padding: 16px 20px;
  color: white;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
  cursor: pointer;
  background: linear-gradient(to right, #1e3c72, #2a5298);
}

.my-location {
  background: linear-gradient(to right, #1e3c72, #2a5298) !important;
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  height: 100%;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.primary-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.location-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.sublocation {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.time {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.weather-condition {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.weather-info {
  text-align: right;
}

.temperature {
  font-size: 48px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 4px;
}

.high-low {
  font-size: 14px;
  opacity: 0.9;
}

.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

.weather-card:hover {
  transform: scale(1.02);
}

/* Special styles for My Location card */
.my-location .location-name {
  font-size: 24px;
  margin-bottom: 4px;
}

.my-location .temperature {
  font-size: 56px;
}
</style> 