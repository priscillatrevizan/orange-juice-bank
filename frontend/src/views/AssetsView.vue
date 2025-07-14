<template>
  <div class="container">
    <BackButton />
    <h2>Ativos</h2>
    <div v-if="tab === 'fundos'">
      <h3>Fundos de Investimento</h3>
      <ul>
        <li v-for="fundo in fundos" :key="fundo.id">
          {{ fundo.name }} ({{ fundo.id }}) - Mín. R$ {{ fundo.minimumInvestment.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}
          <button @click="comprarFundo(fundo)">Comprar</button>
          <button v-if="possuiFundo(fundo.id)" @click="venderFundo(fundo)">Vender</button>
        </li>
      </ul>
    </div>
    <div v-else-if="tab === 'cdb'">
      <h3>CDB</h3>
      <ul>
        <li v-for="cdb in cdbs" :key="cdb.id">
          {{ cdb.name }} ({{ cdb.id }}) - Mín. R$ {{ cdb.minimumInvestment.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}
          <button @click="comprarCDB(cdb)">Comprar</button>
          <button v-if="possuiCDB(cdb.id)" @click="venderCDB(cdb)">Vender</button>
        </li>
      </ul>
    </div>
    <div v-else-if="tab === 'tesouro'">
      <h3>Tesouro Direto</h3>
      <ul>
        <li v-for="td in tesouros" :key="td.id">
          {{ td.name }} ({{ td.id }}) - Mín. R$ {{ td.minimumInvestment.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}
          <button @click="comprarTesouro(td)">Comprar</button>
          <button v-if="possuiTesouro(td.id)" @click="venderTesouro(td)">Vender</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <h3>Ações (Renda Variável)</h3>
      <ul>
        <li v-for="acao in acoes" :key="acao.id">
          {{ acao.symbol }} - {{ acao.name }}: R$ {{ acao.currentPrice.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}
          <button @click="comprarAcao(acao)">Comprar</button>
          <button v-if="possuiAcao(acao.id)" @click="venderAcao(acao)">Vender</button>
        </li>
      </ul>
    </div>
    <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" />

    <!-- Modal de confirmação -->
    <ConfirmModal v-if="modal.visible" :visible="modal.visible" :title="modal.title" @cancel="modal.visible = false" @confirm="modal.onConfirm">
      <div style="margin: 1rem 0;">
        <div>{{ modal.content }}</div>
        <input v-model.number="quantidade.value" type="number" min="1" style="margin-top:1rem; width: 80px;" />
      </div>
    </ConfirmModal>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import Toast from '../components/Toast.vue';
import api from '../services/api';
const route = useRoute();
const tab = ref(route.query.tab || 'acoes');
const acoes = ref([]);
const cdbs = ref([]);
const tesouros = ref([]);
const fundos = ref([]);
const toastMsg = ref('');
const toastType = ref('success');
const investimentos = ref({ acoes: [], cdbs: [], tesouros: [], fundos: [] });

// Modal state
const modal = ref({ visible: false, title: '', content: '', onConfirm: null });
const quantidade = ref(1);
const ativoSelecionado = ref(null);
const tipoOperacao = ref('');

async function carregarAtivos() {
  try {
    const res = await api.get('/assets');
    acoes.value = res.data.stocks || [];
    cdbs.value = (res.data.fixedIncome || []).filter(f => f.type === 'CDB');
    tesouros.value = (res.data.fixedIncome || []).filter(f => f.type?.toLowerCase().includes('tesouro'));
    fundos.value = res.data.funds || [];
  } catch (e) {
    toastType.value = 'error';
    toastMsg.value = 'Erro ao carregar ativos';
  }
}
async function carregarInvestimentos() {
  try {
    const res = await api.get('/transactions');
    investimentos.value.acoes = (res.data || []).filter(t => t.stock).map(t => ({ id: t.stock.id, amount: t.amount, transId: t.id }));
    investimentos.value.cdbs = (res.data || []).filter(t => t.fixedIncome && t.fixedIncome.type === 'CDB').map(t => ({ id: t.fixedIncome.id, amount: t.amount, transId: t.id }));
    investimentos.value.tesouros = (res.data || []).filter(t => t.fixedIncome && t.fixedIncome.type?.toLowerCase().includes('tesouro')).map(t => ({ id: t.fixedIncome.id, amount: t.amount, transId: t.id }));
    investimentos.value.fundos = (res.data || []).filter(t => t.fundInvestment).map(t => ({ id: t.fundInvestment.id, amount: t.amount, transId: t.id }));
  } catch (e) {}
}
function possuiAcao(id) {
  return investimentos.value.acoes.some(a => a.id === id);
}
function possuiCDB(id) {
  return investimentos.value.cdbs.some(c => c.id === id);
}
function possuiTesouro(id) {
  return investimentos.value.tesouros.some(t => t.id === id);
}
function possuiFundo(id) {
  return investimentos.value.fundos.some(f => f.id === id);
}
onMounted(() => {
  carregarAtivos();
  carregarInvestimentos();
});
async function venderAcao(acao) {
  const investimento = investimentos.value.acoes.find(a => a.id === acao.id);
  ativoSelecionado.value = acao;
  tipoOperacao.value = 'venda-acao';
  quantidade.value = 1;
  modal.value = {
    visible: true,
    title: `Vender ações de ${acao.symbol}`,
    content: `Você possui: ${investimento.amount} ações. Informe a quantidade para vender:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0 || quantidade.value > investimento.amount) return;
      const contasRes = await api.get('/accounts');
      const contaInvest = (contasRes.data || []).find(c => c.type === 'investimento');
      try {
        await api.post('/transactions/sell-stock', { stockId: acao.id, quantidade: quantidade.value, investmentAccountId: contaInvest?.id });
        toastType.value = 'success';
        toastMsg.value = 'Venda realizada com sucesso!';
        modal.value.visible = false;
        setTimeout(() => { carregarAtivos(); carregarInvestimentos(); }, 1000);
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao vender ação';
      }
    }
  };
}
async function venderCDB(cdb) {
  const investimento = investimentos.value.cdbs.find(c => c.id === cdb.id);
  ativoSelecionado.value = cdb;
  tipoOperacao.value = 'venda-cdb';
  quantidade.value = 1;
  modal.value = {
    visible: true,
    title: `Vender CDB de ${cdb.name}`,
    content: `Você possui: ${investimento.amount} CDB. Informe a quantidade para vender:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0 || quantidade.value > investimento.amount) return;
      const contasRes = await api.get('/accounts');
      const contaInvest = (contasRes.data || []).find(c => c.type === 'investimento');
      try {
        await api.post('/transactions/sell-fixed-income', { fixedIncomeId: cdb.id, quantidade: quantidade.value, investmentAccountId: contaInvest?.id });
        toastType.value = 'success';
        toastMsg.value = 'Venda de CDB realizada!';
        modal.value.visible = false;
        setTimeout(() => { carregarAtivos(); carregarInvestimentos(); }, 1000);
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao vender CDB';
      }
    }
  };
}
async function venderTesouro(td) {
  const investimento = investimentos.value.tesouros.find(t => t.id === td.id);
  ativoSelecionado.value = td;
  tipoOperacao.value = 'venda-tesouro';
  quantidade.value = 1;
  modal.value = {
    visible: true,
    title: `Vender Tesouro Direto de ${td.name}`,
    content: `Você possui: ${investimento.amount} títulos. Informe a quantidade para vender:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0 || quantidade.value > investimento.amount) return;
      const contasRes = await api.get('/accounts');
      const contaInvest = (contasRes.data || []).find(c => c.type === 'investimento');
      try {
        await api.post('/transactions/sell-fixed-income', { fixedIncomeId: td.id, quantidade: quantidade.value, investmentAccountId: contaInvest?.id });
        toastType.value = 'success';
        toastMsg.value = 'Venda de Tesouro Direto realizada!';
        modal.value.visible = false;
        setTimeout(() => { carregarAtivos(); carregarInvestimentos(); }, 1000);
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao vender Tesouro Direto';
      }
    }
  };
}
async function venderFundo(fundo) {
  const investimento = investimentos.value.fundos.find(f => f.id === fundo.id);
  ativoSelecionado.value = fundo;
  tipoOperacao.value = 'venda-fundo';
  quantidade.value = 1;
  modal.value = {
    visible: true,
    title: `Vender fundo de ${fundo.name}`,
    content: `Você possui: ${investimento.amount} cotas. Informe a quantidade para vender:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0 || quantidade.value > investimento.amount) return;
      const contasRes = await api.get('/accounts');
      const contaInvest = (contasRes.data || []).find(c => c.type === 'investimento');
      try {
        await api.post('/transactions/sell-fund', { fundInvestmentId: fundo.id, quantidade: quantidade.value, investmentAccountId: contaInvest?.id });
        toastType.value = 'success';
        toastMsg.value = 'Venda de fundo realizada!';
        modal.value.visible = false;
        setTimeout(() => { carregarAtivos(); carregarInvestimentos(); }, 1000);
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao vender fundo';
      }
    }
  };
}

async function comprarAcao(acao) {
  ativoSelecionado.value = acao;
  tipoOperacao.value = 'compra-acao';
  quantidade.value = 1;
  modal.value = {
    visible: true,
    title: `Comprar ações de ${acao.symbol}`,
    content: `Preço unitário: R$ ${acao.currentPrice.toLocaleString('pt-BR', {minimumFractionDigits:2})}. Informe a quantidade para comprar:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0) return;
      const taxa = acao.currentPrice * quantidade.value * 0.01;
      try {
        await api.post('/transactions/buy-stock', { stockId: acao.id, quantidade: quantidade.value });
        toastType.value = 'success';
        toastMsg.value = 'Compra realizada com sucesso!';
        modal.value.visible = false;
        setTimeout(carregarAtivos, 1000);
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao comprar ação';
      }
    }
  };
}
async function comprarCDB(cdb) {
  ativoSelecionado.value = cdb;
  tipoOperacao.value = 'compra-cdb';
  quantidade.value = 1;
  modal.value = {
    visible: true,
    title: `Comprar CDB de ${cdb.name}`,
    content: `Preço unitário: R$ ${cdb.minimumInvestment.toLocaleString('pt-BR', {minimumFractionDigits:2})}. Informe a quantidade para comprar:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0) return;
      try {
        await api.post('/transactions/buy-fixed-income', { fixedIncomeId: cdb.id, quantidade: quantidade.value });
        toastType.value = 'success';
        toastMsg.value = 'Compra de CDB realizada!';
        modal.value.visible = false;
        setTimeout(carregarAtivos, 1000);
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao comprar CDB';
      }
    }
  };
}
async function comprarTesouro(td) {
  ativoSelecionado.value = td;
  tipoOperacao.value = 'compra-tesouro';
  quantidade.value = 1;
  modal.value = {
    visible: true,
    title: `Comprar Tesouro Direto de ${td.name}`,
    content: `Preço unitário: R$ ${td.minimumInvestment.toLocaleString('pt-BR', {minimumFractionDigits:2})}. Informe a quantidade para comprar:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0) return;
      try {
        await api.post('/transactions/buy-fixed-income', { fixedIncomeId: td.id, quantidade: quantidade.value });
        toastType.value = 'success';
        toastMsg.value = 'Compra de Tesouro Direto realizada!';
        modal.value.visible = false;
        setTimeout(carregarAtivos, 1000);
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao comprar Tesouro Direto';
      }
    }
  };
}
async function comprarFundo(fundo) {
  ativoSelecionado.value = fundo;
  tipoOperacao.value = 'compra-fundo';
  quantidade.value = 1;
  modal.value = {
    visible: true,
    title: `Comprar fundo de ${fundo.name}`,
    content: `Preço unitário: R$ ${fundo.minimumInvestment.toLocaleString('pt-BR', {minimumFractionDigits:2})}. Informe a quantidade para comprar:`,
    onConfirm: async () => {
      if (!quantidade.value || quantidade.value <= 0) return;
      try {
        await api.post('/transactions/buy-fund', { fundInvestmentId: fundo.id, quantidade: quantidade.value });
        toastType.value = 'success';
        toastMsg.value = 'Compra de fundo realizada!';
        modal.value.visible = false;
        setTimeout(carregarAtivos, 1000);
      } catch (e) {
        toastType.value = 'error';
        toastMsg.value = e.response?.data?.error || 'Erro ao comprar fundo';
      }
    }
  };
}
// ...existing code...
</script>
