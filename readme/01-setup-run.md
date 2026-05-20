# Setup et lancement du projet

Ce fichier explique comment installer, lancer, arreter et tester le projet.

## Prerequis

Installer sur la machine :

- Docker Desktop
- Node.js
- npm
- Git

Avec Docker, il n'est pas obligatoire d'installer MySQL manuellement.
Docker lance MySQL dans un conteneur.

## Lancement recommande avec Docker

Se placer a la racine du projet :

```bash
cd E_doc
```

Lancer tous les services :

```bash
docker compose up --build
```

Cette commande fait 3 choses :

- elle construit l'image Docker du backend
- elle lance MySQL
- elle lance le backend et Prisma Studio

## URLs importantes

Backend API :

```text
http://localhost:5000
```

Prisma Studio :

```text
http://localhost:5555
```

MySQL :

```text
localhost:3307
```

Dans Docker, MySQL utilise le port `3306`.
Sur la machine locale, il est expose sur `3307`.

## Arreter le projet

```bash
docker compose down
```

Cette commande arrete les conteneurs, mais garde les donnees MySQL.

## Reset complet de la base

```bash
docker compose down -v
docker compose up --build
```

`-v` supprime le volume Docker `mysql_data`.
Donc les tables sont recreees et les donnees de test sont remises par `seed.js`.

## Verifier que tout marche

Tester l'accueil de l'API :

```bash
curl http://localhost:5000
```

Tester la liste des formations :

```bash
curl http://localhost:5000/formations
```

Tester la connexion admin :

```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@gmail.com\",\"password\":\"123456\"}"
```

Sur Windows PowerShell, on peut aussi utiliser :

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/formations"
```

## Comptes de test

Compte admin :

```text
email: admin@gmail.com
password: 123456
role: admin
```

Compte etudiant :

```text
email: ali@gmail.com
password: 123456
role: etudiant
```

## Tester les routes admin

Ajouter une formation :

```bash
curl -X POST http://localhost:5000/formations \
  -H "Content-Type: application/json" \
  -H "role: admin" \
  -d "{\"titre\":\"JavaScript\",\"duree\":\"4 semaines\",\"niveau\":\"Debutant\"}"
```

Modifier une formation :

```bash
curl -X PUT http://localhost:5000/formations/1 \
  -H "Content-Type: application/json" \
  -H "role: admin" \
  -d "{\"titre\":\"Developpement Web\",\"duree\":\"2 mois\",\"niveau\":\"Intermediaire\"}"
```

Supprimer une formation :

```bash
curl -X DELETE http://localhost:5000/formations/1 \
  -H "role: admin"
```

## Tester les routes etudiant

Inscrire un etudiant :

```bash
curl -X POST http://localhost:5000/inscriptions \
  -H "Content-Type: application/json" \
  -H "role: etudiant" \
  -d "{\"etudiant_id\":2,\"formation_id\":1}"
```

Voir les inscriptions :

```bash
curl http://localhost:5000/mes-inscriptions/2 \
  -H "role: etudiant"
```

## Prisma Studio

Ouvrir :

```text
http://localhost:5555
```

On peut voir et modifier les tables :

- `User`
- `Formation`
- `Inscription`

Prisma Studio est pratique pour expliquer le projet pendant une presentation.

## Lancement local sans Docker

Cette methode est optionnelle.
Elle demande que MySQL soit deja lance.

Aller dans le backend :

```bash
cd backend
```

Installer les dependances :

```bash
npm install
```

Creer un fichier `.env` :

```env
DATABASE_URL="mysql://root:root@localhost:3307/gestion_etudiants"
PORT=5000
```

Creer les tables et ajouter les donnees :

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

## Lancer le frontend

Aller dans le frontend :

```bash
cd frontend
```

Installer les dependances :

```bash
npm install
```

Lancer Vite :

```bash
npm run dev
```

Le frontend sera affiche dans le terminal avec une URL du style :

```text
http://localhost:5173
```

## Probleme courant : le port est deja utilise

Si `5000`, `5555` ou `3307` est deja utilise, il faut arreter l'ancien service ou changer le port dans `docker-compose.yml`.

## Probleme courant : Docker ne demarre pas

Verifier que Docker Desktop est ouvert.
Puis relancer :

```bash
docker compose up --build
```

## Probleme courant : base de donnees sale

Faire un reset complet :

```bash
docker compose down -v
docker compose up --build
```
