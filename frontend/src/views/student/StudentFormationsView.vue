<template>
  <DashboardLayout
    role="student"
    title="Formations disponibles"
    subtitle="Consultez les formations et inscrivez-vous."
  >
    <div v-if="success" class="alert success">
      {{ success }}
    </div>

    <div v-if="error" class="alert error">
      {{ error }}
    </div>

    <div v-if="loading" class="state-card">
      Chargement des formations...
    </div>

    <section v-else class="formations-grid">
      <div
        v-for="formation in formations"
        :key="formation.id"
        class="course-card"
      >
        <div class="course-top">
          <div class="icon">
            {{ formation.titre.charAt(0) }}
          </div>

          <span class="badge">
            {{ formation.niveau }}
          </span>
        </div>

        <h3>{{ formation.titre }}</h3>

        <p class="duration">
          Durée : {{ formation.duree }}
        </p>

        <button
          :disabled="isRegistered(formation.id) || submittingId === formation.id"
          @click="registerFormation(formation)"
        >
          {{ buttonLabel(formation.id) }}
        </button>
      </div>
    </section>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../layouts/DashboardLayout.vue'
import {
  getCurrentUser,
  getFormations,
  getMesInscriptions,
  inscrireEtudiant
} from '../../services/api'

const router = useRouter()

const formations = ref([])
const inscriptions = ref([])
const loading = ref(true)
const submittingId = ref(null)
const error = ref('')
const success = ref('')

const currentUser = computed(() => getCurrentUser())

const loadStudentData = async () => {
  if (!currentUser.value || currentUser.value.role !== 'etudiant') {
    router.push('/')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const [formationsData, inscriptionsData] = await Promise.all([
      getFormations(),
      getMesInscriptions(currentUser.value.id)
    ])

    formations.value = formationsData
    inscriptions.value = inscriptionsData
  } catch (apiError) {
    error.value = apiError.message
  } finally {
    loading.value = false
  }
}

const isRegistered = (formationId) => {
  return inscriptions.value.some((inscription) => inscription.formationId === formationId)
}

const buttonLabel = (formationId) => {
  if (submittingId.value === formationId) {
    return 'Inscription...'
  }

  return isRegistered(formationId) ? 'Déjà inscrit' : "S'inscrire"
}

const registerFormation = async (formation) => {
  if (isRegistered(formation.id)) {
    return
  }

  submittingId.value = formation.id
  error.value = ''
  success.value = ''

  try {
    await inscrireEtudiant(currentUser.value.id, formation.id)
    await loadStudentData()
    success.value = `Inscription réussie à ${formation.titre}.`
  } catch (apiError) {
    error.value = apiError.message
  } finally {
    submittingId.value = null
  }
}

onMounted(loadStudentData)
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

.formations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
}

.course-card {
  background: white;
  padding: 24px;
  border-radius: 22px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.course-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
}

.badge {
  background: #eef2ff;
  color: #4f46e5;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: bold;
}

h3 {
  margin-bottom: 10px;
  color: #111827;
}

.duration {
  color: #6b7280;
  margin-bottom: 20px;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #4f46e5;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
</style>
