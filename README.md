# E-doc

E-doc est un petit projet etudiant pour gerer des formations: un admin gere les
formations et un etudiant consulte ses inscriptions.

Le projet est garde volontairement simple afin de pouvoir expliquer chaque
fichier pendant une presentation.

## Structure du projet

```text
E_doc/
  backend/
    server.js
    server.test.js
    Dockerfile
    package.json
    README.md
  frontend/
    src/
      main.js
      App.vue
      router/
      views/
    package.json
    README.md
  docker-compose.yml
  README.md
```

## Pourquoi chaque outil est utilise

- Node.js: lance le backend en JavaScript.
- Express: cree les routes API comme `/login` et `/formations`.
- CORS: permet au frontend Vue d'appeler le backend pendant le developpement.
- node:test: teste le backend sans ajouter de bibliotheque de test externe.
- Docker: lance le backend dans un conteneur reproductible.
- Docker Compose: evite de retenir une longue commande Docker.
- Vue: organise l'interface en vues.
- Vue Router: gere les pages du frontend.
- Vite: lance et compile rapidement le frontend.

## Ce qui a ete garde simple

- Pas de base de donnees: les donnees sont dans des tableaux en memoire.
- Pas de JWT: le role est envoye dans le header `role`.
- Pas de Prisma: inutile tant qu'il n'y a pas de base de donnees.
- Pas de Pinia: aucun etat global n'est encore necessaire dans le frontend.
- Pas de template Vite inutile: les composants et assets de demo ont ete
  retires.

## Lancer le backend

```bash
cd backend
npm install
npm start
```

URL:

```text
http://localhost:5000
```

## Tester le backend

```bash
cd backend
npm test
```

## Lancer avec Docker

Depuis la racine:

```bash
docker compose up --build
```

Le backend sera disponible sur `http://localhost:5000`.

## Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

## Comptes de test

```text
Admin    : admin@gmail.com / 123456 / role admin
Etudiant : ali@gmail.com   / 123456 / role etudiant / id 2
```

## API principale

```text
GET    /
POST   /login
GET    /formations
POST   /formations          role: admin
PUT    /formations/:id      role: admin
DELETE /formations/:id      role: admin
POST   /inscriptions        role: etudiant
GET    /mes-inscriptions/:id role: etudiant
```
