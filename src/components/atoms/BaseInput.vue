<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  label?: string;
}

defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" class="label">{{ label }}</label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="input"
      :class="{ 'disabled': disabled }"
    />
  </div>
</template>

<style scoped>
.input-wrapper {
  width: 100%;
}

.label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  background-color: white;
  font-size: 16px;
  color: var(--text-primary);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: #94A3B8;
}

.input.disabled {
  background-color: #F8FAFC;
  cursor: not-allowed;
}
</style>