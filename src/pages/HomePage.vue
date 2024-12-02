<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '@/components/molecules/SearchBar.vue';
import WeatherCard from '@/components/molecules/WeatherCard.vue';
import { useWeatherStore } from '@/stores/weather';
import { User } from 'lucide-vue-next';

const router = useRouter();
const weatherStore = useWeatherStore();

async function getCurrentLocation() {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported');
    return;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude: lat, longitude: lon } = position.coords;
    const locations = await weatherStore.searchLocationsByCoords(lat, lon);
    
    if (locations.length > 0) {
      await weatherStore.setCurrentLocation(locations[0]);
      await weatherStore.fetchWeatherData();
    }
  } catch (error) {
    console.error('Error getting current location:', error);
  }
}

onMounted(async () => {
  await getCurrentLocation();
});

function handleProfileClick() {
  router.push('/profile');
}
</script>

<template>
  <div class="home-page">
    <div class="header">
      <h1 class="title">Weather</h1>
      <button class="profile-button" @click="handleProfileClick">
        <User :size="24" />
      </button>
    </div>
    
    <SearchBar class="search-bar" />
    
    <div v-if="weatherStore.isLoading" class="loading">
      Loading weather data...
    </div>
    
    <div v-else-if="weatherStore.error" class="error">
      {{ weatherStore.error }}
    </div>
    
    <div v-else class="weather-cards">
      <WeatherCard
        v-if="weatherStore.currentLocation"
        :location="weatherStore.currentLocation"
        :is-my-location="true"
      />
      
      <WeatherCard
        v-for="location in weatherStore.savedLocations"
        :key="location.id"
        :location="location"
        v-show="location.id !== weatherStore.currentLocation?.id"
      />
      
      <div v-if="!weatherStore.currentLocation && weatherStore.savedLocations.length === 0" class="empty-state">
        Search for a city to add it to your list
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.profile-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-primary);
  border-radius: 50%;
  transition: background-color 0.2s;
}

.profile-button:hover {
  background-color: var(--background-light);
}

.search-bar {
  margin-bottom: 32px;
}

.weather-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 32px;
  color: var(--text-secondary);
  background: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

.error {
  color: #ef4444;
}

.empty-state {
  font-size: 0.875rem;
}
</style> 