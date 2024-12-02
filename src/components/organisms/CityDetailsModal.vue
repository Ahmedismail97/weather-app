<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, X, Trash2 } from 'lucide-vue-next';
import type { WeatherLocation } from '@/types/weather';
import { useWeatherStore } from '@/stores/weather';
import WeatherIcon from '@/components/atoms/WeatherIcon.vue';
import HourlyForecast from '@/components/organisms/HourlyForecast.vue';

const props = defineProps<{
  location: WeatherLocation;
  isOpen: boolean;
  isFromSearch?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'add'): void;
  (e: 'remove'): void;
}>();

const weatherStore = useWeatherStore();

onMounted(async () => {
  if (props.isFromSearch) {
    await weatherStore.setCurrentLocation(props.location);
    await weatherStore.fetchWeatherData();
  }
});

const isInSavedList = computed(() => {
  return weatherStore.savedLocations.some(loc => loc.id === props.location.id);
});

function handleClose() {
  emit('close');
}

function handleAdd() {
  emit('add');
  handleClose();
}

function handleRemove() {
  emit('remove');
  handleClose();
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <div class="location-info">
          <h2 class="location-name">{{ location.name }}, {{ location.country }}</h2>
          <p class="date" v-if="location.lastWeather">{{ location.lastWeather.date }}</p>
        </div>
        
        <div class="header-actions">
          <button 
            v-if="isFromSearch && !isInSavedList"
            class="action-button add-button" 
            @click="handleAdd"
          >
            <Plus :size="20" />
          </button>
          <button 
            v-if="isInSavedList"
            class="action-button delete-button" 
            @click="handleRemove"
          >
            <Trash2 :size="20" />
          </button>
          <button class="action-button close-button" @click="handleClose">
            <X :size="20" />
          </button>
        </div>
      </header>

      <div v-if="location.lastWeather || weatherStore.currentLocation?.lastWeather" class="weather-content">
        <div class="current-weather">
          <WeatherIcon 
            :condition="(location.lastWeather || weatherStore.currentLocation?.lastWeather)?.condition"
            size="large"
            class="weather-icon"
          />
          <div class="temperature">
            {{ (location.lastWeather || weatherStore.currentLocation?.lastWeather)?.temp }}°C
          </div>
          <div class="condition">{{ (location.lastWeather || weatherStore.currentLocation?.lastWeather)?.condition }}</div>
          <div class="high-low">
            H:{{ (location.lastWeather || weatherStore.currentLocation?.lastWeather)?.high }}° L:{{ (location.lastWeather || weatherStore.currentLocation?.lastWeather)?.low }}°
          </div>
        </div>

        <HourlyForecast 
          v-if="weatherStore.hourlyForecast.length"
          :forecast="weatherStore.hourlyForecast"
          class="hourly-forecast"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.location-info {
  flex: 1;
}

.location-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.date {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.action-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.add-button {
  color: var(--primary-color);
}

.delete-button {
  color: var(--error-color);
}

.weather-content {
  padding: 24px;
}

.current-weather {
  text-align: center;
  margin-bottom: 32px;
}

.weather-icon {
  margin-bottom: 16px;
}

.temperature {
  font-size: 48px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.condition {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.high-low {
  font-size: 16px;
  color: var(--text-secondary);
}

.hourly-forecast {
  margin-top: 24px;
}
</style> 