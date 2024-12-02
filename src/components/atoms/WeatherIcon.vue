<script setup lang="ts">
import { computed } from 'vue';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudDrizzle,
  Cloudy
} from 'lucide-vue-next';

interface Props {
  condition: string;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
});

const iconMap = {
  'Clear': Sun,
  'Clouds': Cloud,
  'Rain': CloudRain,
  'Thunderstorm': CloudLightning,
  'Snow': CloudSnow,
  'Drizzle': CloudDrizzle,
  'Moderate Rain': CloudRain,
  'Heavy Rain': CloudRain,
  'Partly Cloudy': Cloudy,
} as const;

const sizeMap = {
  small: 20,
  medium: 32,
  large: 48,
};

const IconComponent = computed(() => {
  return iconMap[props.condition as keyof typeof iconMap] || Cloud;
});
</script>

<template>
  <component 
    :is="IconComponent" 
    :size="sizeMap[size]"
    :class="['weather-icon', `size-${size}`]"
  />
</template>

<style scoped>
.weather-icon {
  display: inline-block;
  color: currentColor;
}

.size-small {
  opacity: 0.8;
}

.size-large {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
</style> 