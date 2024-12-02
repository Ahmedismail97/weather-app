<script setup lang="ts">
import { ref } from 'vue';
import { Search } from 'lucide-vue-next';
import { useWeatherStore } from '@/stores/weather';
import type { WeatherLocation } from '@/types/weather';
import CityDetailsModal from '@/components/organisms/CityDetailsModal.vue';
import { useRouter } from 'vue-router';

const query = ref('');
const results = ref<WeatherLocation[]>([]);
const isLoading = ref(false);
const weatherStore = useWeatherStore();
const selectedLocation = ref<WeatherLocation | null>(null);
const showModal = ref(false);
const router = useRouter();

async function handleSearch() {
  if (!query.value.trim()) {
    results.value = [];
    return;
  }

  isLoading.value = true;
  results.value = await weatherStore.searchLocations(query.value);
  isLoading.value = false;
}

async function handleLocationSelect(location: WeatherLocation) {
  router.push({
    path: `/weather/${location.id}`,
    query: { fromSearch: 'true' }
  });
  query.value = ''; 
  results.value = []; 
}

function handleCloseModal() {
  showModal.value = false;
  selectedLocation.value = null;
}

function handleAddLocation() {
  if (selectedLocation.value) {
    weatherStore.addToSavedLocations(selectedLocation.value);
  }
}

function handleRemoveLocation() {
  if (selectedLocation.value) {
    weatherStore.removeFromSavedLocations(selectedLocation.value.id);
  }
}
</script>

<template>
  <div class="search-container">
    <div class="search-input">
      <Search :size="20" class="search-icon" />
      <input
        v-model="query"
        type="text"
        placeholder="Search for a city or airport"
        @input="handleSearch"
      >
    </div>

    <div v-if="results.length > 0" class="search-results">
      <button
        v-for="location in results"
        :key="location.id"
        class="result-item"
        @click="handleLocationSelect(location)"
      >
        {{ location.name }}, {{ location.country }}
      </button>
    </div>

    <CityDetailsModal
      v-if="selectedLocation"
      :location="selectedLocation"
      :is-open="showModal"
      :is-from-search="true"
      @close="handleCloseModal"
      @add="handleAddLocation"
      @remove="handleRemoveLocation"
    />
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
}

input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: var(--background-light);
}

.result-item + .result-item {
  border-top: 1px solid var(--border-color);
}
</style> 