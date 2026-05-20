<template>
  <div class="login-page">
    <div class="left-section">
      <div class="logo">
        <span class="logo-mark">E</span>
        <span>E-Doc</span>
      </div>

      <div class="hero-copy">
        <span class="eyebrow">Plateforme e-learning</span>
        <h1>Bienvenue sur votre espace de formation</h1>
        <p>
          Gerez les formations, consultez les cours disponibles et suivez les
          inscriptions depuis une interface simple et moderne.
        </p>
      </div>

      <img
        class="login-illustration"
        :src="elearningIllustration"
        alt="Etudiants en apprentissage en ligne"
      />
    </div>

    <div class="right-section">
      <div class="login-card">
        <div class="card-heading">
          <span class="eyebrow">Connexion securisee</span>
          <h2>Se connecter</h2>
          <p class="subtitle">Connectez-vous a votre espace</p>
        </div>

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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as loginApi, saveCurrentUser } from '../services/api'
import elearningIllustration from '../assets/elearning-illustration.png'

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
  grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
  background:
    radial-gradient(circle at 16% 18%, rgba(244, 114, 182, 0.13), transparent 30%),
    radial-gradient(circle at 66% 84%, rgba(99, 102, 241, 0.08), transparent 28%),
    linear-gradient(135deg, #fbfcff 0%, #f1f5ff 100%);
  font-family: Inter, Arial, sans-serif;
  overflow: hidden;
}

.left-section {
  position: relative;
  padding: 42px 64px;
  color: #111827;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  min-height: 100vh;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  color: #111827;
}

.logo-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #ec4899;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 30px rgba(236, 72, 153, 0.22);
}

.hero-copy {
  max-width: 560px;
  margin-top: 6px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 12px;
  color: #db2777;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.left-section h1 {
  font-size: 46px;
  line-height: 1.12;
  max-width: 600px;
  margin-bottom: 16px;
  color: #0f172a;
}

.left-section p {
  font-size: 17px;
  line-height: 1.65;
  max-width: 520px;
  color: #64748b;
}

.login-illustration {
  width: min(520px, 88%);
  max-height: 310px;
  object-fit: contain;
  align-self: flex-start;
  margin-left: 8px;
  filter: drop-shadow(0 22px 34px rgba(79, 70, 229, 0.13));
}

.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 44px 56px 44px 32px;
}

.login-card {
  width: min(430px, 100%);
  background: rgba(255, 255, 255, 0.96);
  padding: 40px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 16px;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.1);
}

.card-heading {
  margin-bottom: 30px;
}

.login-card h2 {
  font-size: 32px;
  color: #0f172a;
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
  padding: 15px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  outline: none;
  font-size: 15px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

input:focus,
select:focus {
  border-color: #ec4899;
  background: white;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.11);
}

button {
  width: 100%;
  margin-top: 12px;
  padding: 15px;
  border: none;
  border-radius: 10px;
  background: #ec4899;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(236, 72, 153, 0.23);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

button:hover {
  background: #db2777;
  box-shadow: 0 18px 34px rgba(236, 72, 153, 0.28);
  transform: translateY(-1px);
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
    overflow: visible;
  }

  .left-section {
    min-height: auto;
    padding: 30px 24px 12px;
    gap: 22px;
  }

  .left-section h1 {
    font-size: 34px;
  }

  .login-illustration {
    width: min(420px, 92%);
    max-height: 230px;
    align-self: center;
    margin-left: 0;
  }

  .right-section {
    min-height: auto;
    padding: 16px 20px 32px;
  }

  .login-card {
    padding: 28px;
  }
}
</style>
