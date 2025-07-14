<template>
  <button class="back-btn" @click="goBack">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Voltar</span>
  </button>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function goBack() {
  router.back();
}
</script>
<style scoped>
.back-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
  margin-bottom: 1rem;
  gap: 0.5rem;
}
.back-btn svg {
  vertical-align: middle;
}
</style>
