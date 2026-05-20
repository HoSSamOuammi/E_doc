<template>
  <DashboardLayout
    role="admin"
    title="Gestion des formations"
    subtitle="Ajoutez, modifiez et organisez les formations disponibles."
  >
    <section class="form-card">
      <h2>Ajouter une formation</h2>

      <form @submit.prevent="addFormation">
        <input v-model="newFormation.titre" placeholder="Titre de la formation" required />
        <input v-model="newFormation.duree" placeholder="Durée ex: 30h" required />
        <input v-model="newFormation.niveau" placeholder="Niveau ex: Débutant" required />

        <button type="submit">Ajouter</button>
      </form>
    </section>

    <section class="formations-grid">
      <div v-for="formation in formations" :key="formation.id" class="course-card">
        <h3>{{ formation.titre }}</h3>
        <p>Durée : {{ formation.duree }}</p>
        <span>{{ formation.niveau }}</span>

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
  { id: 1, titre: 'Développement Web', duree: '30h', niveau: 'Débutant' },
  { id: 2, titre: 'Base de données', duree: '20h', niveau: 'Intermédiaire' },
  { id: 3, titre: 'Vue.js', duree: '15h', niveau: 'Avancé' }
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
  const duree = prompt('Nouvelle durée :', formation.duree)
  const niveau = prompt('Nouveau niveau :', formation.niveau)

  if (titre && duree && niveau) {
    formation.titre = titre
    formation.duree = duree
    formation.niveau = niveau
  }
}
</script>

<style scoped>
.form-card {
  background: white;
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 25px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.form-card h2 {
  margin-bottom: 18px;
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
}

input {
  padding: 13px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
}

button {
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}

form button {
  background: #4f46e5;
  color: white;
  padding: 13px 18px;
}

.formations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}

.course-card {
  background: white;
  padding: 22px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.course-card h3 {
  margin-bottom: 10px;
}

.course-card p {
  color: #6b7280;
  margin-bottom: 12px;
}

.course-card span {
  display: inline-block;
  background: #eef2ff;
  color: #4f46e5;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  margin-bottom: 18px;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  flex: 1;
  padding: 10px;
}

.edit {
  background: #fff7ed;
  color: #d97706;
}

.delete {
  background: #fef2f2;
  color: #dc2626;
}
</style>