
<template>
  <div class="container">
    <BackButton />
    <h2>Saque</h2>
    <form @submit.prevent="withdraw">
      <div>
        <label>Valor</label>
        <input v-model.number="valor" type="number" min="1" required />
      </div>
      <button type="submit">Sacar</button>
    </form>
    <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import Toast from '../components/Toast.vue';
import api from '../services/api';
const valor = ref('');
const toastMsg = ref('');
const toastType = ref('success');
const router = useRouter();
async function withdraw() {
  toastMsg.value = '';
  try {
    // Buscar contas do usuário para pegar conta corrente
    const contasRes = await api.get('/accounts');
    const contaCorrente = contasRes.data.find(c => c.type === 'corrente');
    if (!contaCorrente) throw new Error('Conta corrente não encontrada');
    await api.post('/accounts/withdraw', { contaId: contaCorrente.id, valor: Number(valor.value) });
    toastType.value = 'success';
    toastMsg.value = 'Saque realizado com sucesso!';
    valor.value = '';
    setTimeout(() => router.push('/dashboard'), 1200);
  } catch (e) {
    toastType.value = 'error';
    toastMsg.value = e.response?.data?.error || e.message || 'Erro ao sacar';
  }
}
</script>
