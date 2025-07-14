
<template>
  <div class="container">
    <BackButton />
    <h2>Depósito</h2>
    <form @submit.prevent="deposit">
      <div>
        <label>Valor</label>
        <input v-model.number="valor" type="number" min="1" required />
      </div>
      <button type="submit">Depositar</button>
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
async function deposit() {
  toastMsg.value = '';
  try {
    // Buscar contas do usuário para pegar conta corrente
    const contasRes = await api.get('/accounts');
    const contaCorrente = contasRes.data.find(c => c.type === 'corrente');
    if (!contaCorrente) throw new Error('Conta corrente não encontrada');
    await api.post('/accounts/deposit', { contaId: contaCorrente.id, valor: Number(valor.value) });
    toastType.value = 'success';
    toastMsg.value = 'Depósito realizado com sucesso!';
    valor.value = '';
    setTimeout(() => router.push('/dashboard'), 1200);
  } catch (e) {
    toastType.value = 'error';
    toastMsg.value = e.response?.data?.error || e.message || 'Erro ao depositar';
  }
}
</script>
