# Backend E-doc

Backend simple pour un projet etudiant.

Le projet utilise :

- Node.js
- Express
- Prisma
- MySQL
- Docker
- Prisma Studio

L'objectif est de garder un backend facile a expliquer en 1h, avec une vraie base de donnees visible dans Prisma Studio.

## Ce que fait le backend

- connexion simple avec email et password
- affichage des formations
- ajout, modification et suppression d'une formation par un admin
- inscription d'un etudiant a une formation
- affichage des inscriptions d'un etudiant

## Structure importante

```text
backend/
  server.js                 # routes Express
  package.json              # scripts npm
  Dockerfile                # image Docker du backend
  docker-entrypoint.sh      # prepare Prisma puis lance le serveur
  prisma/
    schema.prisma           # tables Prisma
    seed.js                 # donnees de test
docker-compose.yml          # MySQL + backend + Prisma Studio
```

## Lancer avec Docker

Depuis la racine du projet :

```bash
docker compose up --build
```

Services disponibles :

```text
Backend API    : http://localhost:5000
Prisma Studio  : http://localhost:5555
MySQL          : localhost:3307
```

Pour arreter :

```bash
docker compose down
```

Pour supprimer aussi les donnees MySQL :

```bash
docker compose down -v
```

## Prisma Studio

Prisma Studio permet de voir les tables dans le navigateur.

Avec Docker, il est lance automatiquement ici :

```text
http://localhost:5555
```

Tables visibles :

- `User`
- `Formation`
- `Inscription`

## Lancer sans Docker

Il faut avoir MySQL lance sur le port `3307`.

Depuis `backend` :

```bash
npm install
```

Creer un fichier `.env` :

```env
DATABASE_URL="mysql://root:root@localhost:3307/gestion_etudiants"
PORT=5000
```

Preparer la base :

```bash
npm run setup
```

Lancer le backend :

```bash
npm start
```

Lancer Prisma Studio :

```bash
npm run studio
```

## Comptes de test

Admin :

```text
email: admin@gmail.com
password: 123456
role: admin
```

Etudiant :

```text
email: ali@gmail.com
password: 123456
role: etudiant
```

## Routes

### Connexion

```http
POST /login
Content-Type: application/json
```

Body :

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Voir les formations

```http
GET /formations
```

### Ajouter une formation

Header :

```text
role: admin
```

Body :

```json
{
  "titre": "JavaScript",
  "duree": "4 semaines"
}
```

### Modifier une formation

```http
PUT /formations/1
```

Header :

```text
role: admin
```

Body :

```json
{
  "titre": "Developpement Web",
  "duree": "2 mois"
}
```

### Supprimer une formation

```http
DELETE /formations/1
```

Header :

```text
role: admin
```

### Inscrire un etudiant

```http
POST /inscriptions
```

Header :

```text
role: etudiant
```

Body :

```json
{
  "etudiant_id": 2,
  "formation_id": 1
}
```

### Voir les inscriptions d'un etudiant

```http
GET /mes-inscriptions/2
```

Header :

```text
role: etudiant
```

## Pourquoi ca reste debutant

- seulement 3 tables
- pas de token JWT
- pas de roles compliques
- les routes sont toutes dans `server.js`
- Prisma remplace les requetes SQL longues
- Docker lance toute l'infrastructure avec une seule commande
