# Frontend explique fichier par fichier

Ce fichier explique les fichiers frontend existants.
Le frontend contient deja des pages visuelles, mais il utilise encore des donnees locales dans les vues.

## `frontend/package.json`

Role du fichier : declarer les dependances et commandes du frontend.

- Ligne 1 : debut du JSON.
- Ligne 2 : nom du projet frontend.
- Ligne 3 : indique que le package n'est pas publie sur npm.
- Ligne 4 : version du frontend.
- Ligne 5 : active les modules ES avec `import`.
- Ligne 6 : debut des scripts.
- Ligne 7 : `npm run dev` lance Vite en mode developpement.
- Ligne 8 : `npm run build` construit la version production.
- Ligne 9 : `npm run preview` previsualise le build.
- Ligne 10 : fin des scripts.
- Ligne 11 : debut des dependances.
- Ligne 12 : Pinia, gestion d'etat Vue.
- Ligne 13 : Vue.
- Ligne 14 : Vue Router.
- Ligne 15 : fin des dependances.
- Ligne 16 : debut des dependances de developpement.
- Ligne 17 : plugin Vue pour Vite.
- Ligne 18 : Vite.
- Lignes 19 a 20 : fermeture du JSON.

## `frontend/vite.config.js`

Role du fichier : configurer Vite.

- Ligne 1 : importe `defineConfig`.
- Ligne 2 : importe le plugin Vue.
- Ligne 4 : commentaire de documentation.
- Ligne 5 : exporte la configuration.
- Ligne 6 : active le plugin Vue.
- Ligne 7 : ferme la configuration.

## `frontend/index.html`

Role du fichier : page HTML de base.

- Ligne 1 : declare un document HTML moderne.
- Ligne 2 : ouvre le HTML.
- Ligne 3 : ouvre le `<head>`.
- Ligne 4 : encodage UTF-8.
- Ligne 5 : icone de l'onglet.
- Ligne 6 : responsive mobile.
- Ligne 7 : titre de l'onglet.
- Ligne 8 : ferme le `<head>`.
- Ligne 9 : ouvre le `<body>`.
- Ligne 10 : div ou Vue monte l'application.
- Ligne 11 : charge `src/main.js`.
- Ligne 12 : ferme le body.
- Ligne 13 : ferme le HTML.

## `frontend/src/main.js`

Role du fichier : point d'entree de Vue.

- Ligne 1 : importe `createApp`.
- Ligne 2 : importe `createPinia`.
- Ligne 4 : importe `App.vue`.
- Ligne 5 : importe le routeur.
- Ligne 7 : cree l'application.
- Ligne 8 : branche Pinia.
- Ligne 9 : branche Vue Router.
- Ligne 10 : monte l'application dans `#app`.

## `frontend/src/App.vue`

Role du fichier : composant principal.

- Ligne 1 : ouvre `<script setup>`.
- Ligne 2 : aucun script n'est encore necessaire ici.
- Ligne 5 : ouvre le template.
- Ligne 6 : affiche la page de la route actuelle.
- Ligne 7 : ferme le template.

## `frontend/src/router/index.js`

Role du fichier : definir les routes frontend.

- Ligne 1 : importe `createRouter` et `createWebHistory`.
- Ligne 3 : importe la page login.
- Ligne 4 : importe la page admin.
- Ligne 5 : importe la page formations etudiant.
- Ligne 6 : importe la page mes formations.
- Ligne 8 : declare le tableau des routes.
- Ligne 9 : `/` affiche `LoginView`.
- Ligne 10 : `/admin/formations` affiche `AdminFormationsView`.
- Ligne 11 : `/student/formations` affiche `StudentFormationsView`.
- Ligne 12 : `/student/my-formation` affiche `MyFormationView`.
- Ligne 13 : ferme le tableau.
- Ligne 15 : cree le routeur.
- Ligne 16 : utilise l'historique du navigateur.
- Ligne 17 : connecte les routes au routeur.
- Ligne 18 : ferme la creation.
- Ligne 20 : exporte le routeur.

## `frontend/src/views/LoginView.vue`

Role du fichier : page de connexion.

### Lignes 1 a 40 : template

- Ligne 1 : ouvre le template.
- Ligne 2 : conteneur principal `.login-page`.
- Ligne 3 : section gauche de presentation.
- Ligne 4 : logo texte `E-Doc`.
- Lignes 6 a 10 : titre et description.
- Ligne 11 : ferme la section gauche.
- Ligne 13 : carte de connexion.
- Lignes 14 a 15 : titre et sous-titre.
- Ligne 17 : formulaire qui appelle `login` sans recharger la page.
- Lignes 18 a 21 : champ email avec `v-model="email"`.
- Lignes 23 a 26 : champ password avec `v-model="password"`.
- Lignes 28 a 34 : select du role avec `v-model="role"`.
- Ligne 36 : bouton de connexion.
- Lignes 37 a 40 : fermeture du formulaire et du template.

### Lignes 42 a 59 : script

- Ligne 42 : ouvre `<script setup>`.
- Ligne 43 : importe `ref`.
- Ligne 44 : importe `useRouter`.
- Ligne 46 : cree l'objet router.
- Lignes 48 a 50 : variables reactives du formulaire.
- Ligne 52 : declare la fonction `login`.
- Lignes 53 a 57 : redirige selon le role choisi.
- Ligne 59 : ferme le script.

### Lignes 61 a 179 : styles

- Lignes 61 a 68 : style global de la page login.
- Lignes 70 a 77 : section gauche avec fond gradient.
- Lignes 79 a 85 : style du logo.
- Lignes 87 a 99 : titre et paragraphe de presentation.
- Lignes 101 a 108 : carte de connexion.
- Lignes 110 a 119 : titre et sous-titre de la carte.
- Lignes 121 a 130 : labels et groupes de formulaire.
- Lignes 132 a 147 : inputs et select.
- Lignes 149 a 164 : bouton et hover.
- Lignes 166 a 179 : version mobile.

## `frontend/src/views/AdminFormationsView.vue`

Role du fichier : page admin pour gerer les formations cote frontend.

### Lignes 1 a 74 : template

- Ligne 1 : ouvre le template.
- Lignes 2 a 12 : layout principal et sidebar.
- Lignes 6 a 11 : liens de navigation.
- Lignes 14 a 24 : topbar avec titre et bouton d'ajout.
- Lignes 26 a 41 : cartes statistiques.
- Lignes 43 a 53 : formulaire d'ajout affiche si `showForm` vaut true.
- Lignes 47 a 49 : champs `titre`, `duree`, `niveau`.
- Ligne 51 : bouton submit.
- Lignes 55 a 71 : grille des formations.
- Ligne 56 : boucle `v-for` sur `formations`.
- Lignes 57 a 64 : icone, badge niveau, titre et duree.
- Lignes 66 a 69 : boutons modifier et supprimer.
- Lignes 72 a 74 : fermeture de la page.

### Lignes 76 a 127 : script

- Ligne 76 : ouvre `<script setup>`.
- Ligne 77 : importe `reactive` et `ref`.
- Ligne 78 : importe `useRouter`.
- Ligne 80 : cree le router.
- Ligne 81 : affiche le formulaire par defaut.
- Lignes 83 a 87 : liste locale des formations.
- Lignes 89 a 93 : objet reactif pour le formulaire.
- Ligne 95 : declare `addFormation`.
- Lignes 96 a 101 : ajoute une formation dans le tableau local.
- Lignes 103 a 105 : vide le formulaire.
- Ligne 108 : declare `deleteFormation`.
- Ligne 109 : supprime une formation du tableau local.
- Ligne 112 : declare `editFormation`.
- Lignes 113 a 115 : demande les nouvelles valeurs avec `prompt`.
- Lignes 117 a 121 : modifie la formation si tous les champs sont remplis.
- Ligne 124 : declare `logout`.
- Ligne 125 : redirige vers `/`.
- Ligne 127 : ferme le script.

### Lignes 129 a 363 : styles

- Lignes 129 a 135 : layout admin global.
- Lignes 137 a 149 : sidebar et marque.
- Lignes 151 a 169 : navigation et etat actif.
- Lignes 171 a 191 : contenu et topbar.
- Lignes 193 a 201 : bouton nouvelle formation.
- Lignes 203 a 227 : cartes statistiques.
- Lignes 229 a 268 : formulaire d'ajout.
- Lignes 270 a 282 : grille et carte formation.
- Lignes 284 a 296 : icone de cours.
- Lignes 298 a 308 : badge du niveau.
- Lignes 310 a 318 : titre et texte de carte.
- Lignes 320 a 341 : boutons modifier/supprimer.
- Lignes 343 a 363 : adaptation mobile.

## `frontend/src/views/StudentFormationsView.vue`

Role du fichier : page liste des formations pour l'etudiant.

- Ligne 1 : ouvre le template.
- Ligne 2 : cree un conteneur.
- Ligne 3 : affiche le titre.
- Ligne 4 : ferme le conteneur.
- Ligne 5 : ferme le template.

## `frontend/src/views/MyFormationView.vue`

Role du fichier : page des formations inscrites.

- Ligne 1 : ouvre le template.
- Ligne 2 : affiche le titre.
- Ligne 3 : ferme le template.

## `frontend/src/components/HelloWorld.vue`

Role du fichier : composant de demo venant du template Vite.
Il n'est plus utilise par `App.vue`, mais il reste dans le projet.

### Lignes 1 a 8 : script

- Ligne 1 : ouvre `<script setup>`.
- Ligne 2 : importe `ref`.
- Ligne 3 : importe le logo Vite.
- Ligne 4 : importe l'image hero.
- Ligne 5 : importe le logo Vue.
- Ligne 7 : cree un compteur reactif.
- Ligne 8 : ferme le script.

### Lignes 10 a 95 : template

- Lignes 10 a 24 : section centrale avec images, texte et compteur.
- Ligne 21 : le clic incremente `count`.
- Lignes 28 a 49 : bloc documentation.
- Lignes 50 a 90 : bloc reseaux sociaux.
- Lignes 93 a 95 : separation et fin du template.

## `frontend/src/assets/main.css`

Role du fichier : styles globaux simples.

- Ligne 1 : cible tous les elements.
- Ligne 2 : inclut les bordures dans la largeur des elements.
- Ligne 3 : retire les marges par defaut.
- Ligne 4 : retire les paddings par defaut.
- Ligne 5 : ferme la regle universelle.
- Ligne 7 : cible le `body`.
- Ligne 8 : definit la police.
- Ligne 9 : definit le fond.
- Ligne 10 : definit la couleur du texte.
- Ligne 11 : ferme `body`.
- Ligne 13 : cible les boutons.
- Ligne 14 : les boutons heritent de la police.
- Ligne 15 : ferme `button`.
- Ligne 17 : cible les liens.
- Ligne 18 : retire le soulignement.
- Ligne 19 : herite la couleur du parent.
- Ligne 20 : ferme `a`.

## `frontend/README.md`

Role du fichier : README par defaut cree par Vite.

- Ligne 1 : titre `Vue 3 + Vite`.
- Ligne 3 : explique que le projet vient du template Vue/Vite.
- Ligne 5 : donne un lien vers la documentation Vue.

## `frontend/.gitignore`

Role du fichier : dire a Git quels fichiers frontend ne doivent pas etre suivis.

- Ligne 1 : commentaire pour la section logs.
- Ligne 2 : ignore le dossier `logs`.
- Ligne 3 : ignore tous les fichiers `.log`.
- Lignes 4 a 7 : ignore les logs npm, yarn, pnpm et lerna.
- Ligne 9 : ignore `node_modules`.
- Ligne 10 : ignore `dist`.
- Ligne 11 : ignore `dist-ssr`.
- Ligne 12 : ignore les fichiers `.local`.
- Ligne 14 : commentaire editeurs.
- Ligne 15 : ignore tout `.vscode`.
- Ligne 16 : garde `.vscode/extensions.json`.
- Ligne 17 : ignore `.idea`.
- Ligne 18 : ignore `.DS_Store`.
- Lignes 19 a 24 : ignore des fichiers temporaires ou projets IDE.

## `frontend/.vscode/extensions.json`

Role du fichier : recommander une extension VS Code.

- Ligne 1 : debut du JSON.
- Ligne 2 : recommande `Vue.volar`.
- Ligne 3 : fin du JSON.

## Etat actuel du frontend

Le frontend est presentable visuellement.
La page admin gere les formations dans un tableau local.
La prochaine etape serait de remplacer ces donnees locales par des appels au backend.
