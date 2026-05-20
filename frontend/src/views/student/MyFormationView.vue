<template>
  <DashboardLayout
    role="student"
    title="Mes formations"
    subtitle="Consultez les formations auxquelles vous êtes inscrit."
  >
    <div v-if="success" class="alert success">
      {{ success }}
    </div>

    <div v-if="error" class="alert error">
      {{ error }}
    </div>

    <div v-if="loading" class="state-card">
      Chargement de vos inscriptions...
    </div>

    <section v-else-if="formations.length" class="formations-list">
      <div
        v-for="formation in formations"
        :key="formation.id"
        class="formation-card"
      >
        <div class="top">
          <div class="icon">
            {{ formation.titre.charAt(0) }}
          </div>

          <span class="badge">
            {{ formation.niveau }}
          </span>
        </div>

        <h2>{{ formation.titre }}</h2>

        <p>
          Durée :
          <strong>{{ formation.duree }}</strong>
        </p>

        <button
          class="leave-btn"
          :disabled="deletingId === formation.id"
          @click="leaveFormation(formation)"
        >
          {{ deletingId === formation.id ? 'Désinscription...' : 'Quitter la formation' }}
        </button>
      </div>
    </section>

    <div v-else class="empty-state">
      <h2>Aucune formation</h2>

      <p>
        Vous n'êtes inscrit à aucune formation pour le moment.
      </p>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../layouts/DashboardLayout.vue'
import {
  getCurrentUser,
  getMesInscriptions,
  supprimerInscription
} from '../../services/api'

const router = useRouter()

const formations = ref([])
const loading = ref(true)
const deletingId = ref(null)
const error = ref('')
const success = ref('')

const loadInscriptions = async () => {
  const currentUser = getCurrentUser()

  if (!currentUser || currentUser.role !== 'etudiant') {
    router.push('/')
    return
  }

  loading.value = true
  error.value = ''

  try {
    formations.value = await getMesInscriptions(currentUser.id)
  } catch (apiError) {
    error.value = apiError.message
  } finally {
    loading.value = false
  }
}

const leaveFormation = async (formation) => {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    router.push('/')
    return
  }

  deletingId.value = formation.id
  error.value = ''
  success.value = ''

  try {
    await supprimerInscription(formation.id, currentUser.id)
    await loadInscriptions()
    success.value = `Vous avez quitté ${formation.titre}.`
  } catch (apiError) {
    error.value = apiError.message
  } finally {
    deletingId.value = null
  }
}

onMounted(loadInscriptions)
</script>

<style scoped>
.alert {
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 24px;
  font-weight: 600;
}

.alert.success {
  background: #ecfdf5;
  color: #047857;
}

.alert.error {
  background: #fef2f2;
  color: #b91c1c;
}

.state-card {
  background: white;
  padding: 24px;
  border-radius: 18px;
  color: #6b7280;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.formations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
}

.formation-card {
  background: white;
  padding: 28px;
  border-radius: 24px;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
}

.badge {
  background: #eef2ff;
  color: #4f46e5;
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: bold;
}

h2 {
  margin-bottom: 14px;
  color: #111827;
}

p {
  color: #6b7280;
  margin-bottom: 24px;
}

.leave-btn {
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 12px;
  background: #ef4444;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.leave-btn:disabled {
  background: #fca5a5;
  cursor: not-allowed;
}

.empty-state {
  background: white;
  padding: 40px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.empty-state h2 {
  margin-bottom: 10px;
}

.empty-state p {
  color: #6b7280;
}
</style>
