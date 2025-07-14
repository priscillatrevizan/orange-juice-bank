<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-box">
      <h3>{{ title }}</h3>
      <slot />
      <div class="modal-actions">
        <button @click="$emit('cancel')" class="btn-cancel">Cancelar</button>
        <button @click="$emit('confirm')" class="btn-confirm">Confirmar</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  visible: Boolean,
  title: { type: String, default: 'Confirmação' }
});
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.modal-box {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 24px #0002;
  text-align: center;
}
.modal-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.btn-cancel {
  background: #eee;
  color: #333;
}
.btn-confirm {
  background: #ff8800;
  color: #fff;
}
.btn-cancel, .btn-confirm {
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cancel:hover { background: #ddd; }
.btn-confirm:hover { background: #e67600; }
</style>
