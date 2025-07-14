
<template>
  <div class="container">
    <h2>Dashboard</h2>
    <p>Bem-vindo(a) ao OrangeJuiceBank!</p>
    <div>
      <router-link to="/deposit">Depósito</router-link> |
      <router-link to="/withdraw">Saque</router-link> |
      <router-link to="/transfer">Transferência</router-link> |
      <router-link to="/assets">Ativos</router-link> |
      <router-link to="/reports">Relatórios</router-link>
    </div>
    <div style="margin-top:2rem;">
      <div style="margin-bottom:1.5rem; display:flex; flex-wrap:wrap; gap:1rem; align-items:center;">
        <span style="font-weight:600; color:#ff8800;">Comprar:</span>
        <router-link to="/assets">Ações</router-link>
        <router-link to="/assets?tab=cdb">CDB</router-link>
        <router-link to="/assets?tab=tesouro">Tesouro Direto</router-link>
        <router-link to="/assets?tab=fundos">Fundos</router-link>
      </div>
      <div v-if="contas.length">
        <h3>Números das Contas</h3>
        <ul>
          <li v-for="conta in contas" :key="conta.id">
            {{ labelTipo(conta.type) }}: {{ conta.id }}
          </li>
        </ul>
      </div>
      <h3>Saldos</h3>
      <ul>
        <li v-for="conta in contas" :key="conta.id">
          {{ labelTipo(conta.type) }}: R$ {{ conta.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
        </li>
      </ul>
      <div style="margin-top:2rem;">
        <h3>Investimentos</h3>
        <template v-if="(
          (investimentos.acoes && investimentos.acoes.length) ||
          (investimentos.cdbs && investimentos.cdbs.length) ||
          (investimentos.tesouros && investimentos.tesouros.length) ||
          (investimentos.fundos && investimentos.fundos.length)
        )">
          <div v-if="investimentos.acoes && investimentos.acoes.length">
            <h4>Ações</h4>
            <table class="ativos-table">
              <thead>
                <tr><th>Símbolo</th><th>Nome</th><th>Quantidade</th><th>Ação</th></tr>
              </thead>
              <tbody>
                <tr v-for="a in investimentos.acoes" :key="a.stock.id">
                  <td>{{ a.stock.symbol }}</td>
                  <td>{{ a.stock.name }}</td>
                  <td>{{ a.amount }}</td>
                  <td><button @click="venderAcao(a)">Vender</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="investimentos.cdbs && investimentos.cdbs.length">
            <h4>CDB</h4>
            <table class="ativos-table">
              <thead>
                <tr><th>Nome</th><th>Quantidade</th><th>Ação</th></tr>
              </thead>
              <tbody>
                <tr v-for="c in investimentos.cdbs" :key="c.fixedIncome.id">
                  <td>{{ c.fixedIncome.name }}</td>
                  <td>{{ c.amount }}</td>
                  <td><button @click="venderCDB(c)">Vender</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="investimentos.tesouros && investimentos.tesouros.length">
            <h4>Tesouro Direto</h4>
            <table class="ativos-table">
              <thead>
                <tr><th>Nome</th><th>Quantidade</th><th>Ação</th></tr>
              </thead>
              <tbody>
                <tr v-for="t in investimentos.tesouros" :key="t.fixedIncome.id">
                  <td>{{ t.fixedIncome.name }}</td>
                  <td>{{ t.amount }}</td>
                  <td><button @click="venderTesouro(t)">Vender</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="investimentos.fundos && investimentos.fundos.length">
            <h4>Fundos de Investimento</h4>
            <table class="ativos-table">
              <thead>
                <tr><th>Nome</th><th>Quantidade</th><th>Ação</th></tr>
              </thead>
              <tbody>
                <tr v-for="f in investimentos.fundos" :key="f.fundInvestment.id">
                  <td>{{ f.fundInvestment.name }}</td>
                  <td>{{ f.amount }}</td>
                  <td><button @click="venderFundo(f)">Vender</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-else>
          <p style="color: #888; margin-top: 1rem;">Você ainda não possui investimentos.</p>
        </template>
      </div>
      <p v-if="erro" style="color:red">{{ erro }}</p>
    </div>
    <ConfirmModal v-if="modal.visible" :visible="modal.visible" :title="modal.title" @cancel="modal.visible = false" @confirm="modal.onConfirm">
      <div style="margin: 1rem 0;">
        <div>{{ modal.content }}</div>
        <input v-model.number="quantidade" type="number" min="1" style="margin-top:1rem; width: 80px;" />
      </div>
    </ConfirmModal>
    <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import api from '../services/api';
const contas = ref([]);
const erro = ref('');
const investimentos = ref({ acoes: [], cdbs: [], tesouros: [], fundos: [] });
const userName = ref('Usuário');
function labelTipo(tipo) {
  if (tipo === 'corrente') return 'Conta Corrente';
  if (tipo === 'investimento') return 'Conta Investimento';
  return tipo;
}
async function carregarContas() {
  erro.value = '';
  try {
    const res = await api.get('/accounts');
    contas.value = res.data;
  } catch (e) {
    erro.value = e.response?.data?.error || 'Erro ao buscar saldos';
  }
}
async function carregarInvestimentos() {
  try {
    const res = await api.get('/transactions');
    investimentos.value.acoes = (res.data || []).filter(t => t.stock).map(t => ({ amount: t.amount, stock: t.stock }));
    investimentos.value.cdbs = (res.data || []).filter(t => t.fixedIncome && t.fixedIncome.type === 'CDB').map(t => ({ amount: t.amount, fixedIncome: t.fixedIncome }));
    investimentos.value.tesouros = (res.data || []).filter(t => t.fixedIncome && t.fixedIncome.type?.toLowerCase().includes('tesouro')).map(t => ({ amount: t.amount, fixedIncome: t.fixedIncome }));
    investimentos.value.fundos = (res.data || []).filter(t => t.fundInvestment).map(t => ({ amount: t.amount, fundInvestment: t.fundInvestment }));
  } catch (e) {
    // Silencia erro de investimentos
  }
}
async function carregarUsuario() {
  try {
    const res = await api.get('/users/me');
    userName.value = res.data?.name || res.data?.email || 'Usuário';
  } catch {}
}
onMounted(() => {
  carregarContas();
  carregarInvestimentos();
  carregarUsuario();
});
// Funções de venda para dashboard
// ...removido import duplicado de ref...
import ConfirmModal from '../components/ConfirmModal.vue';
import Toast from '../components/Toast.vue';
const toastMsg = ref('');
const toastType = ref('success');
const modal = ref({ visible: false, title: '', content: '', onConfirm: null });
const quantidade = ref(1);
function venderAcao(a) {
  quantidade.value = 1;
  const contaInvest = contas.value.find(c => c.type === 'investimento');
  modal.value = {
    visible: true,
    title: `Vender ações de ${a.stock.symbol}`,
    content: `Você possui: ${a.amount} ações. Informe a quantidade para vender:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0 || quantidade.value > a.amount) return;
      try {
        await api.post('/transactions/sell-stock', { stockId: a.stock.id, quantidade: quantidade.value, investmentAccountId: contaInvest?.id });
        toastType.value = 'success';
        toastMsg.value = 'Venda realizada com sucesso!';
        modal.value.visible = false;
        await carregarInvestimentos();
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao vender ação';
      }
    }
  };
}
function venderCDB(c) {
  quantidade.value = 1;
  const contaInvest = contas.value.find(c => c.type === 'investimento');
  modal.value = {
    visible: true,
    title: `Vender CDB de ${c.fixedIncome.name}`,
    content: `Você possui: ${c.amount} CDB. Informe a quantidade para vender:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0 || quantidade.value > c.amount) return;
      try {
        await api.post('/transactions/sell-fixed-income', { fixedIncomeId: c.fixedIncome.id, quantidade: quantidade.value, investmentAccountId: contaInvest?.id });
        toastType.value = 'success';
        toastMsg.value = 'Venda de CDB realizada!';
        modal.value.visible = false;
        await carregarInvestimentos();
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao vender CDB';
      }
    }
  };
}
function venderTesouro(t) {
  quantidade.value = 1;
  const contaInvest = contas.value.find(c => c.type === 'investimento');
  modal.value = {
    visible: true,
    title: `Vender Tesouro Direto de ${t.fixedIncome.name}`,
    content: `Você possui: ${t.amount} títulos. Informe a quantidade para vender:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0 || quantidade.value > t.amount) return;
      try {
        await api.post('/transactions/sell-fixed-income', { fixedIncomeId: t.fixedIncome.id, quantidade: quantidade.value, investmentAccountId: contaInvest?.id });
        toastType.value = 'success';
        toastMsg.value = 'Venda de Tesouro Direto realizada!';
        modal.value.visible = false;
        await carregarInvestimentos();
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao vender Tesouro Direto';
      }
    }
  };
}
function venderFundo(f) {
  quantidade.value = 1;
  const contaInvest = contas.value.find(c => c.type === 'investimento');
  modal.value = {
    visible: true,
    title: `Vender fundo de ${f.fundInvestment.name}`,
    content: `Você possui: ${f.amount} cotas. Informe a quantidade para vender:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0 || quantidade.value > f.amount) return;
      try {
        await api.post('/transactions/sell-fund', { fundInvestmentId: f.fundInvestment.id, quantidade: quantidade.value, investmentAccountId: contaInvest?.id });
        toastType.value = 'success';
        toastMsg.value = 'Venda de fundo realizada!';
        modal.value.visible = false;
        await carregarInvestimentos();
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao vender fundo';
      }
    }
  };
}
</script>
// ...existing code...
