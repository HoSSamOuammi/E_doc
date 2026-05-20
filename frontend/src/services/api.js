const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const CURRENT_USER_KEY = 'e_doc_user'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.message || 'Erreur API.')
  }

  return data
}

export function getCurrentUser() {
  const savedUser = localStorage.getItem(CURRENT_USER_KEY)

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY)
    return null
  }
}

export function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export function getFormations() {
  return request('/formations')
}

export function getMesInscriptions(etudiantId) {
  return request(`/mes-inscriptions/${etudiantId}`, {
    headers: {
      role: 'etudiant'
    }
  })
}

export function inscrireEtudiant(etudiantId, formationId) {
  return request('/inscriptions', {
    method: 'POST',
    headers: {
      role: 'etudiant'
    },
    body: JSON.stringify({
      etudiant_id: etudiantId,
      formation_id: formationId
    })
  })
}

export function supprimerInscription(inscriptionId, etudiantId) {
  return request(`/inscriptions/${inscriptionId}`, {
    method: 'DELETE',
    headers: {
      role: 'etudiant',
      'etudiant-id': String(etudiantId)
    }
  })
}
