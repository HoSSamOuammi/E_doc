<template>
  <DashboardLayout
    role="student"
    title="Formations disponibles"
    subtitle="Consultez les formations et inscrivez-vous."
  >
    <div class="course-toolbar">
      <span class="toolbar-label">Catalogue</span>
      <div class="toolbar-tabs">
        <span class="tab active">Tous</span>
        <span class="tab">Disponibles</span>
        <span class="tab">Inscrits</span>
      </div>
    </div>

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
          <div class="course-cover">
            <div class="icon">
              {{ formation.titre.charAt(0) }}
            </div>
          </div>

          <span class="badge">
            {{ formation.niveau }}
          </span>
        </div>

        <h3>{{ formation.titre }}</h3>

        <p class="duration">
          Duree : {{ formation.duree }}
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

  return isRegistered(formationId) ? 'Deja inscrit' : "S'inscrire"
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
    success.value = `Inscription reussie a ${formation.titre}.`
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

.course-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 16px 18px;
  margin-bottom: 22px;
}

.toolbar-label {
  color: #94a3b8;
  font-weight: 700;
}

.toolbar-tabs {
  display: flex;
  gap: 8px;
}

.tab {
  padding: 9px 14px;
  border-radius: 999px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.tab.active {
  color: #ff2d72;
  background: #fff1f5;
}

.formations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.course-card {
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.1);
}

.course-top {
  position: relative;
  margin-bottom: 20px;
}

.course-cover {
  height: 150px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.55), transparent 28%),
    linear-gradient(135deg, #6366f1, #ff6b5f);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  color: #ff2d72;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: 900;
}

.badge {
  position: absolute;
  right: 16px;
  bottom: -15px;
  background: white;
  color: #ff2d72;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

h3 {
  margin: 0 18px 12px;
  color: #0f172a;
  font-size: 19px;
  line-height: 1.35;
}

.duration {
  color: #64748b;
  margin: 0 18px 22px;
}

button {
  width: calc(100% - 36px);
  margin: 0 18px 18px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #ff2d72;
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(255, 45, 114, 0.2);
}

button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 900px) {
  .course-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
