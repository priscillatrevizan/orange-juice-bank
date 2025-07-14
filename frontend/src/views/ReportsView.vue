<template>
  <div class="container">
    <BackButton />
    <h2>Extrato de Operações</h2>
    <div v-if="erro" style="color:red">{{ erro }}</div>
    <table v-if="extrato.length" class="extrato-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Tipo</th>
          <th>Ativo</th>
          <th>Qtd</th>
          <th>Valor</th>
          <th>Taxa</th>
          <th>Imposto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="op in extrato" :key="op.id">
          <td>{{ formatarData(op.createdAt) }}</td>
          <td>{{ op.type === 'buy' ? 'Compra' : op.type === 'sell' ? 'Venda' : op.tipo || '-' }}</td>
          <td>
            {{ op.stock?.symbol || op.fixedIncome?.name || op.fundInvestment?.name || '-' }}
          </td>
          <td>{{ op.amount || '-' }}</td>
          <td>R$ {{ (op.valor || op.totalBruto || op.valorTotal || '-').toLocaleString('pt-BR', {minimumFractionDigits:2}) }}</td>
          <td v-if="op.taxa">R$ {{ op.taxa.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}</td>
          <td v-else>-</td>
          <td v-if="op.impostoRetido">R$ {{ op.impostoRetido.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}</td>
          <td v-else>-</td>
        </tr>
      </tbody>
    </table>
    <div v-else>Nenhuma operação encontrada.</div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import BackButton from '../components/BackButton.vue';
import api from '../services/api';
const extrato = ref([]);
const erro = ref('');
function formatarData(data) {
  if (!data) return '-';
  return new Date(data).toLocaleString('pt-BR');
}
async function carregarExtrato() {
  erro.value = '';
  try {
    const res = await api.get('/transactions/statement');
    extrato.value = res.data;
  } catch (e) {
    erro.value = e.response?.data?.error || 'Erro ao buscar extrato';
  }
}
onMounted(carregarExtrato);
</script>
<style scoped>
.extrato-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}
.extrato-table th, .extrato-table td {
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  text-align: center;
}
.extrato-table th {
  background: #f5f5f5;
}
</style>
