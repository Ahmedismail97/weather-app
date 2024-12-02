<script setup lang="ts">
import { computed } from 'vue';
import type { HourlyForecast } from '@/types/weather';
import WeatherIcon from '@/components/atoms/WeatherIcon.vue';

const props = defineProps<{
  forecast: HourlyForecast[];
}>();

function formatHour(timestamp: string) {
  const date = new Date(Number(timestamp));
  const localTime = new Date(date.getTime());
  
  return localTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC'
  });
}

const filteredForecast = computed(() => {
  return props.forecast;
});
</script>

<template>
  <div class="hourly-forecast">
    <h3 class="title">Hourly Forecast</h3>
    <div class="forecast-list">
      <div 
        v-for="hour in filteredForecast" 
        :key="hour.time"
        class="forecast-item"
      >
        <span class="time">{{ formatHour(hour.time) }}</span>
        <WeatherIcon 
          :condition="hour.condition"
          size="small"
          class="icon"
        />
        <span class="temp">{{ Math.round(hour.temp) }}°</span>
        <span class="pop" v-if="hour.pop > 0">{{ Math.round(hour.pop * 100) }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hourly-forecast {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.forecast-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.forecast-list::-webkit-scrollbar {
  height: 4px;
}

.forecast-list::-webkit-scrollbar-track {
  background: transparent;
}

.forecast-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 48px;
}

.time {
  font-size: 14px;
  opacity: 0.9;
  white-space: nowrap;
}

.icon {
  margin: 4px 0;
}

.temp {
  font-size: 16px;
  font-weight: 500;
}

.pop {
  font-size: 12px;
  opacity: 0.8;
}
</style>