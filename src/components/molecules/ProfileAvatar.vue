<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';

defineProps<{
  isEditing: boolean;
  imageUrl?: string;
}>();

const randomSeed = Math.random().toString(36).substring(7);
</script>

<template>
  <div class="avatar-container">
    <div class="avatar">
      <img 
        :src="imageUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomSeed}&backgroundColor=b6e3f4`"
        alt="Profile"
        class="avatar-image"
      />
      <button v-if="isEditing" class="edit-button">
        <Pencil :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0;
}

.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 8px; /* Add padding for the white background */
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: contain; /* Changed to contain for better robot avatar display */
  background: white;
}

.edit-button {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2E3A5A;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
  padding: 0;
}

.edit-button:hover {
  transform: scale(1.1);
  background: var(--primary-color);
}
</style> 