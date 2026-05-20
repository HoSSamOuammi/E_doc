<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="brand">E-Doc</div>

      <nav>
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="active"
        >
          {{ item.label }}
        </RouterLink>

        <button class="logout-btn" @click="logout">
          Déconnexion
        </button>
      </nav>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <h2>{{ title }}</h2>
          <p>{{ subtitle }}</p>
        </div>
      </header>

      <section class="page-content">
        <slot />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { sidebarConfig } from '../config/sidebarConfig'
import { clearCurrentUser } from '../services/api'

const props = defineProps({
  role: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Tableau de bord'
  },
  subtitle: {
    type: String,
    default: 'Bienvenue dans votre espace.'
  }
})

const router = useRouter()

const menuItems = computed(() => {
  return sidebarConfig[props.role] || []
})

const logout = () => {
  clearCurrentUser()
  router.push('/')
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  background: #f6f7fb;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 245px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 28px 20px;
}

.brand {
  color: #4f46e5;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 36px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-link,
.logout-btn {
  padding: 13px 14px;
  border-radius: 12px;
  color: #6b7280;
  font-weight: 600;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
}

.nav-link:hover,
.nav-link.active {
  background: #eef2ff;
  color: #4f46e5;
}

.logout-btn {
  margin-top: 24px;
  color: #dc2626;
}

.logout-btn:hover {
  background: #fef2f2;
}

.main-content {
  flex: 1;
  padding: 32px;
}

.topbar {
  background: white;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.topbar h2 {
  color: #111827;
  margin-bottom: 6px;
  font-size: 28px;
}

.topbar p {
  color: #6b7280;
}

.page-content {
  width: 100%;
}
</style>
