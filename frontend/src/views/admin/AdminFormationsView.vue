<template>
  <DashboardLayout
    role="admin"
    title="Gestion des formations"
    subtitle="Ajoutez, modifiez et organisez les formations disponibles."
  >
    <div class="course-toolbar">
      <div class="toolbar-search">Rechercher une formation</div>
      <div class="toolbar-tabs">
        <span class="tab active">Toutes</span>
        <span class="tab">Publiees</span>
        <span class="tab">Brouillons</span>
      </div>
    </div>

    <section class="form-card">
      <h2>Ajouter une formation</h2>

      <form @submit.prevent="addFormation">
        <input v-model="newFormation.titre" placeholder="Titre de la formation" required />
        <input v-model="newFormation.duree" placeholder="Duree ex: 30h" required />
        <input v-model="newFormation.niveau" placeholder="Niveau ex: Debutant" required />

        <button type="submit">Ajouter</button>
      </form>
    </section>

    <section class="formations-grid">
      <div v-for="formation in formations" :key="formation.id" class="course-card">
        <div class="course-cover">
          <span>{{ formation.titre.charAt(0) }}</span>
        </div>

        <div class="course-category">Formation</div>
        <h3>{{ formation.titre }}</h3>
        <p class="course-meta">Duree : {{ formation.duree }}</p>
        <span class="course-level">{{ formation.niveau }}</span>

        <div class="actions">
          <button class="edit" @click="editFormation(formation)">Modifier</button>
          <button class="delete" @click="deleteFormation(formation.id)">Supprimer</button>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import DashboardLayout from '../../layouts/DashboardLayout.vue'

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
</script>

<style scoped>
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

.toolbar-search {
  color: #94a3b8;
  font-weight: 600;
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

.form-card {
  background: white;
  padding: 24px;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  margin-bottom: 28px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.04);
}

.form-card h2 {
  margin-bottom: 18px;
  color: #0f172a;
  font-size: 20px;
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
}

input {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  background: #f8fafc;
  font-size: 14px;
}

input:focus {
  border-color: #ff2d72;
  background: white;
  box-shadow: 0 0 0 4px rgba(255, 45, 114, 0.1);
}

button {
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

form button {
  background: #ff2d72;
  color: white;
  padding: 13px 20px;
  box-shadow: 0 14px 24px rgba(255, 45, 114, 0.22);
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

.course-cover {
  height: 150px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), transparent 28%),
    linear-gradient(135deg, #6366f1, #ff6b5f);
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-cover span {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  color: #ff2d72;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
}

.course-category,
.course-card h3,
.course-meta,
.course-level,
.actions {
  margin-left: 18px;
  margin-right: 18px;
}

.course-category {
  margin-top: 18px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.course-card h3 {
  margin-top: 12px;
  margin-bottom: 12px;
  color: #0f172a;
  font-size: 19px;
  line-height: 1.35;
}

.course-meta {
  color: #6b7280;
  margin-bottom: 12px;
}

.course-level {
  display: inline-block;
  background: #fff1f5;
  color: #ff2d72;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 18px;
}

.actions {
  display: flex;
  gap: 10px;
  padding-bottom: 18px;
}

.actions button {
  flex: 1;
  padding: 10px;
}

.edit {
  background: #f8fafc;
  color: #475569;
}

.delete {
  background: #fef2f2;
  color: #dc2626;
}

@media (max-width: 900px) {
  .course-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  form {
    grid-template-columns: 1fr;
  }
}
</style>
