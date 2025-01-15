<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1 class="auth-title">
        <span v-if="isLogin" class="auth-mode">Login</span>
        <span v-else class="auth-mode">Register</span>
      </h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
          />
        </div>
        <button type="submit">
          <span v-if="isLogin">Login</span>
          <span v-else>Register</span>
        </button>
      </form>
      <p @click="toggleMode" class="toggle-mode">
        <span v-if="isLogin">Need an account? Register</span>
        <span v-else>Already have an account? Login</span>
      </p>
    </div>
  </div>
</template>

  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
  
const router = useRouter();
const isLogin = ref(true);
const username = ref('');
const password = ref('');
  
const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

const handleSubmit = async () => {
  try {
    let endpoint;
    if (isLogin.value) {
      endpoint = '/api/auth/login';
    } else {
      endpoint = '/api/auth/register';
    }
  
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
      username: username.value,
      password: password.value,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
  
    if (isLogin.value) {
      localStorage.setItem('token', data.token);
      router.push('/tasks');
    } else {
        isLogin.value = true;
        username.value = '';
        password.value = '';
        alert('Registration successful! Please login.');
      }
    } catch (error) {
      alert(error.message);
    }
};
</script>
  
<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.auth-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #4CAF50;
}

.auth-mode {
  display: inline-block;
  padding: 5px 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.toggle-mode {
  margin-top: 15px;
  text-align: center;
  color: #4CAF50;
  cursor: pointer;
}
</style>