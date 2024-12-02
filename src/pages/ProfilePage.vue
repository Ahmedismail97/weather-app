<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';
import BaseInput from '@/components/atoms/BaseInput.vue';
import ProfileAvatar from '@/components/molecules/ProfileAvatar.vue';

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

const router = useRouter();
const isEditing = ref(false);
const profileData = ref<ProfileData>({
  fullName: 'Jane Doe',
  email: 'jane@gmail.com',
  phoneNumber: '+01 234 567 89'
});

function handleBack() {
  router.push('/');
}

function handleEdit() {
  isEditing.value = true;
}

function handleSave() {
  isEditing.value = false;
}
</script>

<template>
  <div class="profile-page">
    <header class="header">
      <button class="back-button" @click="handleBack">
        <ChevronLeft :size="24" />
      </button>
      <h1 class="title">Edit Profile</h1>
      <div class="spacer"></div>
      <div class="wave-box"></div>
    </header>
    <div class="profile-content">
      <ProfileAvatar 
        :is-editing="isEditing"
        class="avatar"
      />

      <form class="form" @submit.prevent="handleSave">
        <BaseInput
          v-model="profileData.fullName"
          label="Full Name"
          placeholder="Enter your full name"
          :disabled="!isEditing"
        />

        <BaseInput
          v-model="profileData.email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          :disabled="!isEditing"
        />

        <BaseInput
          v-model="profileData.phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          :disabled="!isEditing"
        />

        <div class="actions">
          <button 
            v-if="!isEditing" 
            type="button" 
            class="edit-button"
            @click="handleEdit"
          >
            Edit Profile
          </button>
          <button 
            v-else 
            type="submit" 
            class="save-button"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  position: relative;
  background: var(--background-light);
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 0;
  z-index: 2;
  position: relative;
}

.title {
  position: absolute;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}
.wave-box {
  width: 100%;
  height: 155px;
  background: linear-gradient(180deg, #FFFFFF 0%, #f6f7fb 60%);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  border-bottom-left-radius: 40%;
  border-bottom-right-radius: 40%;
}

.back-button {
  background: none;
  z-index: 2;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-primary);
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.05);
}


.spacer {
  width: 24px;
}

.profile-content {
  position: relative;
  z-index: 2;
  max-width: 400px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  margin-bottom: 32px;
  z-index: 2;
  padding: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.actions {
  margin-top: 8px;
}

.edit-button,
.save-button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #2E3A5A;
  color: white;
}

.edit-button:hover,
.save-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.edit-button:active,
.save-button:active {
  transform: translateY(0);
}
</style> 