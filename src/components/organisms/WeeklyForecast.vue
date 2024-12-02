<script setup lang="ts">
import WeatherIcon from '@/components/atoms/WeatherIcon.vue';
import { ChevronRight } from 'lucide-vue-next';
import type { DailyForecast } from '@/types/weather';

defineProps<{
  forecast: DailyForecast[];
}>();
</script>

<template>
  <div class="weekly-forecast">
    <h3 class="title">7-Day Forecast</h3>
    <div class="forecast-list">
      <div 
        v-for="(item, index) in forecast" 
        :key="index"
        class="forecast-item"
      >
        <div class="day">{{ item.day }}</div>
        <div class="weather">
          <WeatherIcon :condition="item.condition" size="small" />
          <span class="condition">{{ item.condition }}</span>
        </div>
        <div class="temp-section">
          <span class="temp">{{ item.temp }}°</span>
          <ChevronRight class="chevron" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weekly-forecast {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 24px;
  margin: 16px 0;
  color: white;
}

.title {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 500;
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.forecast-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  padding: 12px;
  border-radius: 16px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.forecast-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.day {
  font-weight: 500;
  font-size: 15px;
}

.weather {
  display: flex;
  align-items: center;
  gap: 12px;
}

.condition {
  opacity: 0.8;
  font-size: 15px;
}

.temp-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.temp {
  font-size: 20px;
  font-weight: 500;
}

.chevron {
  opacity: 0.5;
}
</style> 