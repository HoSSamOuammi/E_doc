<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">E-Doc</div>

      <nav>
        <a class="active">Formations</a>
        <a>Etudiants</a>
        <a>Inscriptions</a>
        <a @click="logout">Deconnexion</a>
      </nav>
    </aside>

    <main class="content">
      <header class="topbar">
        <div>
          <h1>Gestion des formations</h1>
          <p>Ajoutez, modifiez et organisez les formations disponibles.</p>
        </div>

        <button class="add-btn" @click="showForm = !showForm">
          + Nouvelle formation
        </button>
      </header>

      <section class="stats">
        <div class="stat-card">
          <span>Total formations</span>
          <strong>{{ formations.length }}</strong>
        </div>

        <div class="stat-card">
          <span>Etudiants inscrits</span>
          <strong>24</strong>
        </div>

        <div class="stat-card">
          <span>Categorie active</span>
          <strong>Web</strong>
        </div>
      </section>

      <section v-if="showForm" class="form-card">
        <h2>Ajouter une formation</h2>

        <form @submit.prevent="addFormation">
          <input
            v-model="newFormation.titre"
            placeholder="Titre de la formation"
            required
          />
          <input v-model="newFormation.duree" placeholder="Duree ex: 30h" required />
          <input
            v-model="newFormation.niveau"
            placeholder="Niveau ex: Debutant"
            required
          />

          <button type="submit">Ajouter la formation</button>
        </form>
      </section>

      <section class="formations-grid">
        <div
          v-for="formation in formations"
          :key="formation.id"
          class="course-card"
        >
          <div class="course-icon">
            {{ formation.titre.charAt(0) }}
          </div>

          <span class="badge">{{ formation.niveau }}</span>

          <h3>{{ formation.titre }}</h3>
          <p>Duree : {{ formation.duree }}</p>

          <div class="course-footer">
            <button class="edit" @click="editFormation(formation)">
              Modifier
            </button>
            <button class="delete" @click="deleteFormation(formation.id)">
              Supprimer
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showForm = ref(true)

const formations = ref([
  { id: 1, titre: 'Developpement Web', duree: '30h', niveau: 'Debutant' },
  { id: 2, titre: 'Base de donnees', duree: '20h', niveau: 'Intermediaire' },
  { id: 3, titre: 'Vue.js', duree: '15h', niveau: 'Avance' }
])

const newFormation = reactive({
  titre: '',
  duree: '',
  niveau: ''
})

const addFormation = () => {
  formations.value.push({
    id: Date.now(),
    titre: newFormation.titre,
    duree: newFormation.duree,
    niveau: newFormation.niveau
  })

  newFormation.titre = ''
  newFormation.duree = ''
  newFormation.niveau = ''
}

const deleteFormation = (id) => {
  formations.value = formations.value.filter((formation) => formation.id !== id)
}

const editFormation = (formation) => {
  const titre = prompt('Nouveau titre :', formation.titre)
  const duree = prompt('Nouvelle duree :', formation.duree)
  const niveau = prompt('Nouveau niveau :', formation.niveau)

  if (titre && duree && niveau) {
    formation.titre = titre
    formation.duree = duree
    formation.niveau = niveau
  }
}

const logout = () => {
  router.push('/')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  background: #f6f7fb;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 250px;
  background: white;
  padding: 30px 22px;
  border-right: 1px solid #e5e7eb;
}

.brand {
  font-size: 26px;
  font-weight: bold;
  color: #4f46e5;
  margin-bottom: 40px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

nav a {
  padding: 14px 16px;
  border-radius: 14px;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
}

nav a:hover,
nav a.active {
  background: #eef2ff;
  color: #4f46e5;
}

.content {
  flex: 1;
  padding: 35px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.topbar h1 {
  font-size: 34px;
  color: #111827;
  margin-bottom: 8px;
}

.topbar p {
  color: #6b7280;
}

.add-btn {
  padding: 14px 22px;
  border: none;
  border-radius: 16px;
  background: #4f46e5;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  padding: 22px;
  border-radius: 22px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.stat-card span {
  color: #6b7280;
  font-size: 14px;
}

.stat-card strong {
  display: block;
  margin-top: 10px;
  font-size: 28px;
  color: #111827;
}

.form-card {
  background: white;
  padding: 25px;
  border-radius: 24px;
  margin-bottom: 28px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.form-card h2 {
  margin-bottom: 18px;
}

.form-card form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
}

input {
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f9fafb;
  outline: none;
}

input:focus {
  border-color: #6366f1;
  background: white;
}

.form-card button {
  padding: 14px 20px;
  border: none;
  border-radius: 14px;
  background: #10b981;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.formations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.course-card {
  position: relative;
  background: white;
  padding: 24px;
  border-radius: 26px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.07);
}

.course-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 18px;
}

.badge {
  position: absolute;
  top: 24px;
  right: 24px;
  background: #ecfdf5;
  color: #059669;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: bold;
}

.course-card h3 {
  color: #111827;
  margin-bottom: 10px;
}

.course-card p {
  color: #6b7280;
  margin-bottom: 22px;
}

.course-footer {
  display: flex;
  gap: 10px;
}

.course-footer button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.edit {
  background: #f59e0b;
}

.delete {
  background: #ef4444;
}

@media (max-width: 900px) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .topbar,
  .form-card form {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
