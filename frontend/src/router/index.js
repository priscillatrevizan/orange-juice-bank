import { createRouter, createWebHistory } from 'vue-router';
import AssetsView from '../views/AssetsView.vue';
import DashboardView from '../views/DashboardView.vue';
import DepositView from '../views/DepositView.vue';
import LoginView from '../views/LoginView.vue';
import ReportsView from '../views/ReportsView.vue';
import TransferView from '../views/TransferView.vue';
import WithdrawView from '../views/WithdrawView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/deposit', name: 'Deposit', component: DepositView },
  { path: '/withdraw', name: 'Withdraw', component: WithdrawView },
  { path: '/transfer', name: 'Transfer', component: TransferView },
  { path: '/assets', name: 'Assets', component: AssetsView },
  { path: '/reports', name: 'Reports', component: ReportsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
