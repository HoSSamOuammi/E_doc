<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">E</span>
        <span>E-Doc</span>
      </div>

      <nav>
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="active"
        >
          <span class="nav-icon" :class="`icon-${item.icon}`"></span>
          {{ item.label }}
        </RouterLink>

        <button class="logout-btn" @click="logout">
          <span class="nav-icon icon-logout"></span>
          Deconnexion
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
  background: #f7f8fb;
  font-family: Inter, Arial, sans-serif;
}

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 28px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #111827;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 38px;
  padding: 0 10px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff2d72;
  color: white;
  box-shadow: 0 14px 28px rgba(255, 45, 114, 0.24);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-link,
.logout-btn {
  min-height: 48px;
  padding: 12px 14px;
  border-radius: 14px;
  color: #64748b;
  font-weight: 600;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.nav-icon {
  width: 32px;
  height: 32px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 32px;
  background: #f1f5f9;
  color: #475569;
}

.nav-icon::before {
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
}

.icon-book::before {
  content: "B";
}

.icon-users::before {
  content: "U";
}

.icon-list::before {
  content: "L";
}

.icon-award::before {
  content: "A";
}

.icon-logout::before {
  content: "X";
}

.nav-link:hover,
.nav-link.active {
  background: #fff1f5;
  color: #ff2d72;
  transform: translateX(2px);
}

.nav-link.active .nav-icon,
.nav-link:hover .nav-icon {
  background: #ff2d72;
  color: white;
}

.logout-btn {
  margin-top: 24px;
  color: #dc2626;
}

.logout-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

.logout-btn:hover .nav-icon {
  background: #dc2626;
  color: white;
}

.main-content {
  flex: 1;
  padding: 34px;
  min-width: 0;
}

.topbar {
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 22px;
  padding: 34px;
  margin-bottom: 26px;
  text-align: center;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.05);
}

.topbar h2 {
  color: #0f172a;
  margin-bottom: 8px;
  font-size: 38px;
  line-height: 1.1;
}

.topbar p {
  color: #64748b;
}

.page-content {
  width: 100%;
}

@media (max-width: 900px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
  }

  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .nav-link,
  .logout-btn {
    flex: 1 1 180px;
  }

  .main-content {
    padding: 20px;
  }

  .topbar h2 {
    font-size: 30px;
  }
}
</style>
