<template>
  <div class="container">
    <BackButton />
    <h2>Transferência</h2>
    <form @submit.prevent="transfer">
      <div>
        <label>Conta Destino</label>
        <input v-model="contaDestino" type="text" required />
      </div>
      <div>
        <label>Valor</label>
        <input v-model="valor" type="number" min="1" required />
      </div>
      <button type="submit">Transferir</button>
    </form>
    <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import BackButton from '../components/BackButton.vue';
import Toast from '../components/Toast.vue';
import api from '../services/api';
const contaDestino = ref('');
const valor = ref('');
const toastMsg = ref('');
const toastType = ref('success');
const contas = ref([]);
const contaOrigemId = ref('');

async function carregarContas() {
  try {
    const res = await api.get('/accounts');
    contas.value = res.data;
    // Seleciona conta corrente como origem padrão
    const corrente = contas.value.find(c => c.type === 'corrente');
    if (corrente) contaOrigemId.value = corrente.id;
  } catch {}
}
carregarContas();

async function transfer() {
  toastMsg.value = '';
  try {
    const destino = contas.value.find(c => String(c.id) === String(contaDestino.value));
    if (!contaOrigemId.value || !destino) throw new Error('Selecione contas válidas.');
    if (contaOrigemId.value === destino.id) throw new Error('Contas de origem e destino devem ser diferentes.');
    await api.post('/transfers/internal', {
      contaOrigemId: contaOrigemId.value,
      contaDestinoId: destino.id,
      valor: Number(valor.value)
    });
    toastType.value = 'success';
    toastMsg.value = 'Transferência realizada com sucesso!';
    contaDestino.value = '';
    valor.value = '';
    carregarContas();
  } catch (e) {
    toastType.value = 'error';
    toastMsg.value = e.response?.data?.error || e.message || 'Erro ao transferir';
  }
}
</script>
