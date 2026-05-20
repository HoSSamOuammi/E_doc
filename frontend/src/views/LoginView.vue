<template>
  <div class="login-page">
    <div class="left-section">
      <div class="logo">E-Doc</div>

      <h1>Bienvenue sur votre plateforme de formation</h1>
      <p>
        Gerez les formations, consultez les cours disponibles et suivez les
        inscriptions depuis une interface simple et moderne.
      </p>
    </div>

    <div class="login-card">
      <h2>Connexion</h2>
      <p class="subtitle">Connectez-vous a votre espace</p>

      <form @submit.prevent="login">
        <p v-if="error" class="error-message">{{ error }}</p>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input
            v-model="password"
            type="password"
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <div class="form-group">
          <label>Role</label>
          <select v-model="role">
            <option value="admin">Administrateur</option>
            <option value="etudiant">Etudiant</option>
          </select>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as loginApi, saveCurrentUser } from '../services/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const role = ref('etudiant')
const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await loginApi(email.value, password.value)
    const user = response.user

    if (user.role !== role.value) {
      error.value = 'Le role selectionne ne correspond pas a ce compte.'
      return
    }

    saveCurrentUser(user)

    if (user.role === 'admin') {
      router.push('/admin/formations')
      return
    }

    router.push('/student/formations')
  } catch (apiError) {
    error.value = apiError.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: #f6f7fb;
  font-family: Arial, sans-serif;
}

.left-section {
  padding: 70px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  position: absolute;
  top: 35px;
  left: 70px;
  font-size: 26px;
  font-weight: bold;
}

.left-section h1 {
  font-size: 48px;
  line-height: 1.1;
  max-width: 650px;
  margin-bottom: 24px;
}

.left-section p {
  font-size: 18px;
  line-height: 1.7;
  max-width: 560px;
  opacity: 0.9;
}

.login-card {
  width: 430px;
  margin: auto;
  background: white;
  padding: 38px;
  border-radius: 28px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1);
}

.login-card h2 {
  font-size: 30px;
  color: #111827;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 14px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f9fafb;
  outline: none;
  font-size: 15px;
}

input:focus,
select:focus {
  border-color: #6366f1;
  background: white;
}

button {
  width: 100%;
  margin-top: 10px;
  padding: 15px;
  border: none;
  border-radius: 16px;
  background: #4f46e5;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #4338ca;
}

button:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.error-message {
  padding: 12px 14px;
  margin-bottom: 18px;
  border-radius: 12px;
  background: #fef2f2;
  color: #b91c1c;
  font-weight: 600;
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .left-section {
    display: none;
  }

  .login-card {
    width: 90%;
  }
}
</style>
