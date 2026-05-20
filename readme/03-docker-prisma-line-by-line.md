# Docker, MySQL et Prisma expliques

Ce fichier explique les fichiers qui permettent de lancer l'infrastructure du projet.

## `docker-compose.yml`

Role du fichier : lancer plusieurs conteneurs avec une seule commande.

Commande :

```bash
docker compose up --build
```

### Lignes 1 a 17 : service MySQL

- Ligne 1 : debut de la liste des services Docker.
- Ligne 2 : declare le service `db`.
- Ligne 3 : utilise l'image officielle `mysql:8.4`.
- Ligne 4 : nom du conteneur : `e-doc-db`.
- Ligne 5 : redemarre le conteneur sauf si on l'arrete manuellement.
- Ligne 6 : debut des variables d'environnement MySQL.
- Ligne 7 : mot de passe root de MySQL : `root`.
- Ligne 8 : cree la base `gestion_etudiants`.
- Ligne 9 : debut des ports.
- Ligne 10 : expose MySQL localement sur `3307`, mais dans Docker il reste sur `3306`.
- Ligne 11 : debut des volumes.
- Ligne 12 : garde les donnees MySQL dans le volume `mysql_data`.
- Ligne 13 : debut du healthcheck.
- Ligne 14 : commande qui verifie que MySQL repond.
- Ligne 15 : Docker teste toutes les 10 secondes.
- Ligne 16 : un test ne doit pas depasser 5 secondes.
- Ligne 17 : Docker essaie 10 fois avant de considerer MySQL non disponible.

### Lignes 19 a 31 : service backend

- Ligne 19 : declare le service `backend`.
- Ligne 20 : debut de la configuration de build.
- Ligne 21 : Docker construit l'image depuis le dossier `./backend`.
- Ligne 22 : nom du conteneur : `e-doc-backend`.
- Ligne 23 : redemarre automatiquement sauf arret manuel.
- Ligne 24 : indique les dependances.
- Ligne 25 : le backend depend de `db`.
- Ligne 26 : le backend attend que MySQL soit healthy.
- Ligne 27 : debut des variables d'environnement du backend.
- Ligne 28 : port interne du backend.
- Ligne 29 : URL MySQL vue depuis Docker. Le host est `db`, pas `localhost`.
- Ligne 30 : debut des ports.
- Ligne 31 : expose l'API sur `localhost:5000`.

### Lignes 33 a 45 : service Prisma Studio

- Ligne 33 : declare le service `prisma-studio`.
- Ligne 34 : debut du build.
- Ligne 35 : utilise aussi le dossier `./backend`.
- Ligne 36 : nom du conteneur.
- Ligne 37 : redemarre automatiquement sauf arret manuel.
- Ligne 38 : indique les dependances.
- Ligne 39 : Prisma Studio depend de `db`.
- Ligne 40 : attend que MySQL soit healthy.
- Ligne 41 : debut des variables d'environnement.
- Ligne 42 : URL MySQL vue depuis Docker.
- Ligne 43 : commande lancee dans le conteneur.
- Ligne 43 : `npx prisma db push` cree les tables.
- Ligne 43 : `npm run seed` ajoute les donnees de test.
- Ligne 43 : `npm run studio` lance Prisma Studio.
- Ligne 44 : debut des ports.
- Ligne 45 : expose Prisma Studio sur `localhost:5555`.

### Lignes 47 a 48 : volumes

- Ligne 47 : debut de la liste des volumes Docker.
- Ligne 48 : declare `mysql_data`, utilise par MySQL.

## `backend/Dockerfile`

Role du fichier : expliquer comment construire l'image Docker du backend.

- Ligne 1 : part de l'image Node.js 20 Alpine, petite et suffisante pour le projet.
- Ligne 3 : definit `/app` comme dossier de travail dans le conteneur.
- Ligne 5 : copie `package.json` et `package-lock.json`.
- Ligne 6 : installe les dependances exactement depuis `package-lock.json`.
- Ligne 8 : copie le dossier Prisma avant le reste.
- Ligne 9 : genere le client Prisma dans `node_modules`.
- Ligne 11 : copie le reste du backend.
- Ligne 12 : rend `docker-entrypoint.sh` executable.
- Ligne 14 : indique que le conteneur utilise le port `5000`.
- Ligne 16 : commande lancee quand le conteneur demarre.

## `backend/docker-entrypoint.sh`

Role du fichier : preparer la base puis lancer le serveur.

- Ligne 1 : indique que le script utilise `sh`.
- Ligne 2 : stoppe le script si une commande echoue.
- Ligne 4 : affiche un message dans les logs Docker.
- Ligne 5 : synchronise le schema Prisma avec MySQL.
- Ligne 6 : ajoute les donnees de test.
- Ligne 8 : affiche un message avant le lancement.
- Ligne 9 : lance `npm start`, donc `node server.js`.

## `backend/prisma/schema.prisma`

Role Docker/Prisma :

- Prisma lit ce fichier pour savoir quelles tables creer.
- `docker-entrypoint.sh` lance `npx prisma db push`.
- `prisma db push` lit `schema.prisma`.
- MySQL recoit les tables `users`, `formations`, `inscriptions`.

## `backend/prisma/seed.js`

Role Docker/Prisma :

- Docker lance ce fichier apres `prisma db push`.
- Le script ajoute l'admin.
- Le script ajoute l'etudiant.
- Le script ajoute deux formations.
- Le script ajoute une inscription de test.

## `backend/.env.example`

Role en local :

```env
DATABASE_URL="mysql://root:root@localhost:3307/gestion_etudiants"
PORT=5000
```

Dans Docker, ces variables sont definies dans `docker-compose.yml`.
En local, elles sont mises dans `.env`.

## Difference entre `localhost` et `db`

Dans `.env.example` :

```text
localhost:3307
```

On utilise `localhost` car le backend est lance sur la machine.

Dans `docker-compose.yml` :

```text
db:3306
```

On utilise `db` car le backend est dans Docker et parle au service Docker `db`.

## Commandes utiles

Construire :

```bash
docker compose build backend
```

Lancer :

```bash
docker compose up --build
```

Arreter :

```bash
docker compose down
```

Reset complet :

```bash
docker compose down -v
docker compose up --build
```

Voir les conteneurs :

```bash
docker compose ps
```

Voir les logs :

```bash
docker compose logs backend
docker compose logs prisma-studio
docker compose logs db
```
