<template>
  <DashboardLayout
    role="student"
    title="Mes formations"
    subtitle="Consultez les formations auxquelles vous etes inscrit."
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
          <div class="course-cover">
            <div class="icon">
              {{ formation.titre.charAt(0) }}
            </div>
          </div>

          <span class="badge">
            {{ formation.niveau }}
          </span>
        </div>

        <h2>{{ formation.titre }}</h2>

        <p>
          Duree :
          <strong>{{ formation.duree }}</strong>
        </p>

        <button
          class="leave-btn"
          :disabled="deletingId === formation.id"
          @click="leaveFormation(formation)"
        >
          {{ deletingId === formation.id ? 'Desinscription...' : 'Quitter la formation' }}
        </button>
      </div>
    </section>

    <div v-else class="empty-state">
      <h2>Aucune formation</h2>

      <p>
        Vous n'etes inscrit a aucune formation pour le moment.
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
    success.value = `Vous avez quitte ${formation.titre}.`
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
  border-radius: 12px;
  margin-bottom: 24px;
  font-weight: 600;
  border: 1px solid transparent;
}

.alert.success {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #047857;
}

.alert.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #b91c1c;
}

.state-card {
  background: white;
  padding: 24px;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  color: #6b7280;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.05);
}

.formations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.formation-card {
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  overflow: hidden;
  max-width: 500px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.formation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.1);
}

.top {
  position: relative;
  margin-bottom: 22px;
}

.course-cover {
  height: 160px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.55), transparent 28%),
    linear-gradient(135deg, #6366f1, #ff6b5f);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 68px;
  height: 68px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  color: #ff2d72;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 900;
}

.badge {
  position: absolute;
  right: 16px;
  bottom: -15px;
  background: white;
  color: #ff2d72;
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

h2 {
  margin: 0 20px 14px;
  color: #0f172a;
  font-size: 22px;
  line-height: 1.35;
}

p {
  color: #64748b;
  margin: 0 20px 24px;
}

.leave-btn {
  width: calc(100% - 40px);
  margin: 0 20px 20px;
  padding: 13px;
  border: none;
  border-radius: 10px;
  background: #ef4444;
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(239, 68, 68, 0.18);
}

.leave-btn:disabled {
  background: #fca5a5;
  cursor: not-allowed;
  box-shadow: none;
}

.empty-state {
  background: white;
  padding: 46px;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.05);
}

.empty-state h2 {
  margin-bottom: 10px;
}

.empty-state p {
  color: #6b7280;
}
</style>
