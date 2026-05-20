# Backend E-doc

Backend simple pour un projet etudiant de gestion de formations.

Le but est de montrer une API REST avec Node.js et Express, sans base de
donnees et sans configuration compliquee. Les donnees sont stockees dans des
tableaux en memoire dans `server.js`.

## Pourquoi ces choix

- Node.js: permet d'ecrire le backend en JavaScript.
- Express: simplifie la creation des routes HTTP.
- CORS: autorise le frontend a appeler le backend pendant le developpement.
- node:test: permet de tester l'API sans installer Jest ou Supertest.
- Docker: permet de lancer le backend dans un environnement identique sur une
  autre machine.
- Pas de base de donnees: le projet reste facile a comprendre et a presenter.
- Pas de Prisma: inutile tant qu'il n'y a pas de vraie base de donnees.
- Pas de JWT: les roles sont envoyes dans le header `role` pour garder un
  exemple simple.

## Structure

```text
backend/
  Dockerfile       # image Docker du backend
  server.js        # application Express et routes
  server.test.js   # tests HTTP du backend
  package.json     # scripts et dependances
  .dockerignore    # fichiers ignores pendant le build Docker
  .gitignore       # fichiers locaux ignores par Git
```

## Installation

Depuis le dossier `backend`:

```bash
npm install
```

## Lancer le serveur

```bash
npm start
```

Le backend ecoute par defaut sur:

```text
http://localhost:5000
```

## Tester le backend

```bash
npm test
```

Les tests demarrent l'application sur un port temporaire et verifient les
routes principales: accueil, connexion, gestion admin des formations et
inscriptions etudiant.

## Lancer avec Docker

Depuis la racine du projet:

```bash
docker compose up --build
```

Le service expose le backend sur `http://localhost:5000`.

## Comptes de test

Admin:

```text
email: admin@gmail.com
password: 123456
role: admin
```

Etudiant:

```text
email: ali@gmail.com
password: 123456
role: etudiant
id: 2
```

## Routes

```text
GET    /
POST   /login
GET    /formations
POST   /formations           role: admin
PUT    /formations/:id       role: admin
DELETE /formations/:id       role: admin
POST   /inscriptions         role: etudiant
GET    /mes-inscriptions/:id role: etudiant
```

## Exemple de formation

```json
{
  "titre": "JavaScript",
  "duree": "4 semaines",
  "niveau": "Debutant"
}
```

## Limites volontaires

- Les donnees disparaissent au redemarrage.
- Les mots de passe sont en clair pour un exemple de cours uniquement.
- Le header `role` remplace une vraie authentification.
- Il n'y a pas encore de validation avancee ni de base de donnees.
