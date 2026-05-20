# Backend E-doc

Backend simple pour un projet etudiant.

Le but est de montrer les bases d'une API REST avec Node.js et Express, sans base de donnees et sans configuration compliquee.

## Ce que fait le backend

- connexion simple avec email et password
- affichage des formations
- ajout, modification et suppression d'une formation par un admin
- inscription d'un etudiant a une formation
- affichage des inscriptions d'un etudiant

Les donnees sont stockees dans des tableaux dans `server.js`.
Quand le serveur redemarre, les donnees reviennent au depart.

## Fichiers importants

```text
backend/
  server.js       # toutes les routes de l'API
  package.json    # scripts et dependances
```

## Installation

Depuis le dossier `backend` :

```bash
npm install
```

## Lancer le serveur

```bash
npm start
```

Le backend est disponible ici :

```text
http://localhost:5000
```

## Tester rapidement

```bash
npm test
```

Cette commande verifie seulement que `server.js` ne contient pas d'erreur de syntaxe.

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
id: 2
```

## Routes

### Accueil

```http
GET /
```

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

Cette route est reservee a l'admin.
Il faut envoyer le header `role: admin`.

```http
POST /formations
Content-Type: application/json
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
Content-Type: application/json
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
role: admin
```

### Inscrire un etudiant

Cette route est reservee a l'etudiant.
Il faut envoyer le header `role: etudiant`.

```http
POST /inscriptions
Content-Type: application/json
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
role: etudiant
```

## Pourquoi c'est simple

- pas de base de donnees
- pas de Prisma
- pas de Docker
- pas de token JWT
- un seul fichier principal a expliquer
- des commentaires courts dans le code
