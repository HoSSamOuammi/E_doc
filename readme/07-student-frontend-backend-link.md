# Liaison backend/frontend - espace etudiant

Ce document explique le travail realise pour connecter le frontend Vue.js avec le backend Express/Prisma au niveau du parcours etudiant.

## Objectif

Avant la modification, les pages etudiant utilisaient des donnees statiques dans les composants Vue :

- `StudentFormationsView.vue` affichait une liste de formations codee en dur.
- `MyFormationView.vue` affichait une formation codee en dur.
- `LoginView.vue` redirigeait sans appeler le backend.
- Le bouton `Quitter la formation` ne pouvait pas modifier la base de donnees, car le backend ne proposait pas encore de route de desinscription.

Le but etait de relier ces ecrans aux vraies donnees MySQL via l'API Express.

## Backend analyse

Le backend se trouve dans `backend/server.js`.

Technologies utilisees :

- Express pour exposer l'API HTTP.
- Prisma Client pour lire/ecrire dans MySQL.
- CORS pour autoriser les appels du frontend.
- Middleware simple `verifierRole(roleAttendu)` qui controle le header HTTP `role`.

Modeles Prisma concernes :

- `User` : contient les utilisateurs avec un champ `role`.
- `Formation` : contient les formations disponibles.
- `Inscription` : table de liaison entre un etudiant et une formation.

Routes backend deja presentes et utilisees :

- `POST /login` : connexion avec `email` et `password`.
- `GET /formations` : liste des formations.
- `POST /inscriptions` : inscription d'un etudiant a une formation.
- `GET /mes-inscriptions/:id` : formations auxquelles un etudiant est inscrit.

## Modifications backend

### 1. Ajout de `formationId` dans `/mes-inscriptions/:id`

La route retournait seulement :

```json
{
  "id": 1,
  "titre": "Developpement Web",
  "duree": "3 mois",
  "niveau": "Debutant"
}
```

Le frontend avait besoin de connaitre l'id de la formation pour savoir si une formation de la liste est deja inscrite.

La reponse contient maintenant aussi :

```json
{
  "id": 1,
  "formationId": 2,
  "titre": "Developpement Web",
  "duree": "3 mois",
  "niveau": "Debutant"
}
```

Important :

- `id` correspond a l'id de l'inscription.
- `formationId` correspond a l'id de la formation.

### 2. Ajout de la route `DELETE /inscriptions/:id`

Cette route permet a l'etudiant de quitter une formation.

Requete :

```http
DELETE /inscriptions/1
role: etudiant
etudiant-id: 2
```

Comportement :

- Verifie que l'id est valide.
- Verifie que l'id etudiant est fourni dans le header `etudiant-id`.
- Cherche l'inscription dans la base.
- Retourne `404` si elle n'existe pas.
- Retourne `403` si l'inscription n'appartient pas a cet etudiant.
- Supprime l'inscription avec Prisma.
- Retourne un message de succes.

## Frontend analyse

Le frontend se trouve dans `frontend/src`.

Fichiers importants :

- `views/LoginView.vue`
- `views/student/StudentFormationsView.vue`
- `views/student/MyFormationView.vue`
- `layouts/DashboardLayout.vue`
- `router/index.js`

Avant la modification, les vues etudiant n'avaient pas de communication HTTP avec le backend.

## Modifications frontend

### 1. Creation de `frontend/src/services/api.js`

Ce fichier centralise les appels API.

Il contient :

- `request(path, options)` : wrapper autour de `fetch`.
- `login(email, password)` : appelle `POST /login`.
- `getFormations()` : appelle `GET /formations`.
- `getMesInscriptions(etudiantId)` : appelle `GET /mes-inscriptions/:id`.
- `inscrireEtudiant(etudiantId, formationId)` : appelle `POST /inscriptions`.
- `supprimerInscription(inscriptionId)` : appelle `DELETE /inscriptions/:id`.
- `saveCurrentUser(user)` : sauvegarde l'utilisateur connecte dans `localStorage`.
- `getCurrentUser()` : recupere l'utilisateur connecte.
- `clearCurrentUser()` : supprime la session locale.

L'URL de l'API est configurable :

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
```

Donc, par defaut, le frontend appelle :

```text
http://localhost:5000
```

Pour changer l'URL, creer un fichier `.env` dans `frontend` :

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 2. Connexion reelle dans `LoginView.vue`

Le formulaire appelle maintenant le backend avec :

```js
loginApi(email.value, password.value)
```

Si la connexion reussit :

- l'utilisateur est sauvegarde dans `localStorage`;
- le role retourne par le backend est compare au role choisi dans le formulaire;
- un admin va vers `/admin/formations`;
- un etudiant va vers `/student/formations`.

Si le backend retourne une erreur, elle est affichee dans l'interface.

Comptes de test fournis par `backend/prisma/seed.js` :

```text
Admin    : admin@gmail.com / 123456
Etudiant : ali@gmail.com / 123456
```

### 3. Protection des routes dans `router/index.js`

Les routes admin et etudiant ont maintenant un `meta.role`.

Exemples :

```js
{ path: '/student/formations', component: StudentFormationsView, meta: { role: 'etudiant' } }
{ path: '/admin/formations', component: AdminFormationsView, meta: { role: 'admin' } }
```

Un guard Vue Router verifie l'utilisateur dans `localStorage`.

Si aucun utilisateur n'est connecte, ou si le role ne correspond pas, l'utilisateur est redirige vers `/`.

### 4. Page `StudentFormationsView.vue`

Cette page charge maintenant deux donnees depuis le backend :

- toutes les formations avec `GET /formations`;
- les inscriptions de l'etudiant connecte avec `GET /mes-inscriptions/:id`.

Elle affiche :

- un etat de chargement;
- les erreurs API;
- un message de succes apres inscription;
- un bouton desactive si l'etudiant est deja inscrit a la formation.

Au clic sur `S'inscrire`, la page appelle :

```js
inscrireEtudiant(currentUser.value.id, formation.id)
```

Puis elle recharge les donnees pour synchroniser l'interface avec la base.

### 5. Page `MyFormationView.vue`

Cette page affiche les vraies inscriptions de l'etudiant connecte.

Elle appelle :

```js
getMesInscriptions(currentUser.id)
```

Elle gere :

- le chargement;
- les erreurs API;
- l'etat vide quand l'etudiant n'a aucune inscription;
- la desinscription.

Au clic sur `Quitter la formation`, elle appelle :

```js
supprimerInscription(formation.id, currentUser.id)
```

Ici, `formation.id` correspond a l'id de l'inscription retourne par le backend.

### 6. Deconnexion dans `DashboardLayout.vue`

Le bouton de deconnexion supprime maintenant l'utilisateur du `localStorage` avant de retourner vers la page de login.

```js
clearCurrentUser()
router.push('/')
```

## Flux complet etudiant

1. L'etudiant ouvre le frontend.
2. Il se connecte avec `ali@gmail.com / 123456`.
3. Le frontend appelle `POST /login`.
4. Le backend retourne l'utilisateur sans password.
5. Le frontend stocke l'utilisateur dans `localStorage`.
6. L'etudiant arrive sur `/student/formations`.
7. Le frontend charge les formations et les inscriptions.
8. L'etudiant clique sur `S'inscrire`.
9. Le frontend appelle `POST /inscriptions`.
10. Le backend cree une ligne dans la table `inscriptions`.
11. La page recharge les donnees.
12. Dans `/student/my-formation`, l'etudiant voit ses inscriptions.
13. Il peut cliquer sur `Quitter la formation`.
14. Le frontend appelle `DELETE /inscriptions/:id`.
15. Le backend supprime l'inscription.

## Commandes pour lancer le projet

Depuis la racine du projet :

```powershell
docker compose up -d db
```

Puis backend :

```powershell
cd "C:\Users\Hp\Desktop\projet test\TP fullstack\E_doc\backend"
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run prisma:push
npm.cmd run seed
npm.cmd start
```

Puis frontend :

```powershell
cd "C:\Users\Hp\Desktop\projet test\TP fullstack\E_doc\frontend"
npm.cmd install
npm.cmd run dev
```

Remarque Windows :

Si PowerShell bloque `npm`, utiliser `npm.cmd`.

## Verification effectuee

Les verifications suivantes ont ete executees :

```powershell
node --check backend\server.js
```

Resultat : syntaxe backend valide.

```powershell
cd frontend
npm.cmd run build
```

Resultat : build Vite reussi.

## Limites techniques actuelles

L'authentification reste volontairement simple pour un projet pedagogique :

- pas de JWT;
- pas de hash du mot de passe;
- role envoye dans un header HTTP simple;
- session frontend stockee dans `localStorage`.

Pour une version production, il faudrait ajouter :

- hash des passwords avec `bcrypt`;
- JWT ou session serveur;
- middleware d'authentification robuste;
- variables d'environnement dediees pour frontend et backend.
