# Backend - Gestion des etudiants et des formations

Backend simple avec Node.js, Express, MySQL et Prisma.

## Installation

Placez-vous dans le dossier `backend` puis installez les dependances :

```bash
npm install
```

## Configuration MySQL

1. Creez un fichier `.env` dans `backend`
2. Ajoutez votre connexion MySQL

Exemple :

```env
DATABASE_URL="mysql://root:@localhost:3306/gestion_etudiants"
```

## Base de donnees avec Prisma

1. Creez la base `gestion_etudiants` dans MySQL
2. Lancez Prisma pour creer les tables
3. Ajoutez les donnees de test

Commandes :

```bash
npm run prisma:push
npm run seed
```

Le fichier `database.sql` est aussi disponible si vous voulez creer la base manuellement.

## Lancer le serveur

```bash
npm start
```

Le serveur demarre sur :

```text
http://localhost:5000
```

## Comptes de test

- Admin : `admin@gmail.com` / `123456`
- Etudiant : `ali@gmail.com` / `123456`

## Authentification simple

Le projet utilise un login simple avec `email` + `password`.

Pour les routes protegees, envoyez aussi le header `role` :

- `role: admin` pour ajouter, modifier ou supprimer une formation
- `role: etudiant` pour faire une inscription ou voir les inscriptions

## Routes

- `POST /login`
- `GET /formations`
- `POST /formations`
- `PUT /formations/:id`
- `DELETE /formations/:id`
- `POST /inscriptions`
- `GET /mes-inscriptions/:id`

## Exemples de body JSON

### Login

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Ajouter une formation

```json
{
  "titre": "JavaScript",
  "duree": "4 mois"
}
```

### Inscription

```json
{
  "etudiant_id": 2,
  "formation_id": 1
}
```
