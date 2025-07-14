<template>
  <div v-if="visible" :class="['toast', type]">
    {{ message }}
  </div>
</template>
<script setup>
import { onUnmounted, ref, watch } from 'vue';
const props = defineProps({
  message: String,
  type: { type: String, default: 'success' },
  duration: { type: Number, default: 2500 }
});
const visible = ref(true);
let timer = null;
watch(() => props.message, () => {
  visible.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => visible.value = false, props.duration);
});
onUnmounted(() => clearTimeout(timer));
</script>
<style scoped>
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #333;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 9999;
  font-size: 1rem;
  opacity: 0.95;
  transition: opacity 0.3s;
}
.toast.success { background: #27ae60; }
.toast.error { background: #c0392b; }
</style>
