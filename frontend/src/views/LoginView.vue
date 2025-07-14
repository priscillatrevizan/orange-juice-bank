<template>
  <div class="container-login">
    <h1>OrangeJuiceBank</h1>
    <form @submit.prevent="login">
      <div class="input-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div class="input-group">
        <label>CPF</label>
        <input v-model="cpf" type="text" required maxlength="11" />
      </div>
      <button type="submit">Entrar</button>
      <p v-if="error" style="color:red">{{ error }}</p>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
const email = ref('');
const cpf = ref('');
const error = ref('');
const router = useRouter();
async function login() {
  error.value = '';
  try {
    const res = await api.post('/auth/login', { email: email.value, cpf: cpf.value });
    localStorage.setItem('token', res.data.token);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao fazer login';
  }
}
</script>
