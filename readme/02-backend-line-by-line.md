# Backend explique fichier par fichier

Ce fichier explique les fichiers backend.
Les lignes vides servent seulement a aerer le code.
Les accolades `}`, `});` et `]` ferment les blocs ouverts juste avant.

## `backend/server.js`

Role du fichier : lancer l'API Express et definir toutes les routes.

### Lignes 1 a 12 : imports et configuration

- Ligne 1 : charge le fichier `.env` avec `dotenv`.
- Ligne 3 : importe Express, le framework HTTP.
- Ligne 4 : importe `cors`, qui autorise le frontend a appeler le backend.
- Ligne 5 : importe `PrismaClient`, l'outil qui parle avec MySQL.
- Ligne 7 : cree l'application Express.
- Ligne 8 : cree le client Prisma.
- Ligne 9 : lit le port depuis `.env`, sinon utilise `5000`.
- Ligne 11 : active CORS.
- Ligne 12 : permet a Express de lire le JSON envoye dans les requetes.

### Lignes 14 a 27 : middleware de role

- Ligne 14 : commentaire qui explique le choix simple du projet.
- Ligne 15 : declare la fonction `verifierRole`.
- Ligne 16 : retourne un middleware Express.
- Ligne 17 : lit le role envoye dans le header HTTP `role`.
- Ligne 19 : compare le role recu au role attendu.
- Lignes 20 a 22 : renvoie une erreur `403` si le role n'est pas correct.
- Ligne 25 : laisse passer la requete si le role est correct.
- Ligne 27 : ferme la fonction.

Exemple :

```http
role: admin
```

### Lignes 29 a 37 : cacher le password

- Ligne 29 : declare la fonction `cacherPassword`.
- Ligne 30 : commence l'objet a retourner.
- Lignes 31 a 35 : garde seulement les infos utiles de l'utilisateur.
- Ligne 36 : ne retourne pas le champ `password`.
- Ligne 37 : ferme la fonction.

Cette fonction evite d'envoyer le mot de passe dans la reponse JSON.

### Lignes 39 a 44 : reponse d'erreur serveur

- Ligne 39 : declare la fonction `erreurServeur`.
- Ligne 40 : renvoie un statut HTTP `500`.
- Ligne 41 : message simple pour le client.
- Ligne 42 : affiche le vrai message d'erreur pour aider pendant le TP.
- Lignes 43 a 44 : ferment la reponse et la fonction.

### Lignes 46 a 59 : route d'accueil

- Ligne 46 : cree la route `GET /`.
- Ligne 47 : renvoie une reponse JSON.
- Ligne 48 : indique que l'API fonctionne.
- Lignes 49 a 57 : liste les routes disponibles.
- Lignes 58 a 59 : ferment la route.

Tester :

```bash
curl http://localhost:5000
```

### Lignes 61 a 92 : route `POST /login`

- Ligne 61 : commentaire de la route.
- Ligne 62 : cree une route `POST /login`.
- Ligne 63 : recupere `email` et `password` depuis `req.body`.
- Lignes 65 a 69 : verifient que les deux champs existent.
- Ligne 71 : commence le bloc `try`.
- Ligne 72 : cherche un utilisateur avec Prisma.
- Lignes 73 a 76 : condition de recherche : meme email et meme password.
- Ligne 79 : si aucun utilisateur n'est trouve.
- Lignes 80 a 82 : renvoie une erreur `401`.
- Ligne 85 : renvoie une reponse JSON.
- Ligne 86 : message de succes.
- Ligne 87 : renvoie l'utilisateur sans password.
- Ligne 89 : attrape les erreurs.
- Ligne 90 : renvoie une erreur serveur propre.
- Ligne 92 : ferme la route.

Exemple de body :

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Lignes 94 a 107 : route `GET /formations`

- Ligne 94 : commentaire.
- Ligne 95 : cree la route `GET /formations`.
- Ligne 96 : commence le `try`.
- Ligne 97 : demande a Prisma toutes les formations.
- Lignes 98 a 100 : trie les formations par `id` croissant.
- Ligne 103 : renvoie la liste en JSON.
- Ligne 104 : attrape une erreur possible.
- Ligne 105 : renvoie une erreur serveur.
- Ligne 107 : ferme la route.

### Lignes 109 a 135 : route `POST /formations`

- Ligne 109 : commentaire.
- Ligne 110 : cree la route `POST /formations`.
- Ligne 110 : ajoute `verifierRole("admin")`, donc seul l'admin passe.
- Ligne 111 : recupere `titre`, `duree` et `niveau`.
- Lignes 113 a 117 : verifient que les trois champs sont remplis.
- Ligne 119 : commence le `try`.
- Ligne 120 : cree une formation avec Prisma.
- Lignes 121 a 125 : envoie les champs a enregistrer dans MySQL.
- Ligne 127 : renvoie le statut `201`, creation reussie.
- Ligne 128 : message de succes.
- Ligne 129 : renvoie la formation creee.
- Lignes 131 a 132 : gerent les erreurs.
- Ligne 134 : ferme la route.

### Lignes 137 a 181 : route `PUT /formations/:id`

- Ligne 137 : commentaire.
- Ligne 138 : cree la route `PUT /formations/:id`.
- Ligne 138 : reserve la route a l'admin.
- Ligne 139 : convertit le parametre `id` en nombre.
- Ligne 140 : recupere `titre`, `duree` et `niveau`.
- Lignes 141 a 145 : refuse un id invalide.
- Lignes 148 a 152 : refuse un body incomplet.
- Ligne 153 : commence le `try`.
- Ligne 154 : cherche la formation par id.
- Ligne 155 : indique le champ de recherche.
- Lignes 158 a 162 : renvoie `404` si la formation n'existe pas.
- Ligne 164 : modifie la formation.
- Ligne 165 : indique quelle formation modifier.
- Lignes 167 a 171 : nouveaux champs.
- Lignes 174 a 177 : renvoie le resultat.
- Lignes 178 a 180 : gerent les erreurs.
- Ligne 181 : ferme la route.

### Lignes 183 a 214 : route `DELETE /formations/:id`

- Ligne 183 : commentaire.
- Ligne 184 : cree la route de suppression.
- Ligne 184 : reserve la route a l'admin.
- Ligne 185 : convertit `id` en nombre.
- Lignes 187 a 191 : refuse un id invalide.
- Ligne 193 : commence le `try`.
- Ligne 194 : cherche la formation.
- Ligne 195 : cherche avec `id`.
- Lignes 198 a 202 : renvoie `404` si rien n'est trouve.
- Ligne 204 : supprime la formation.
- Ligne 205 : precise l'id a supprimer.
- Lignes 208 a 210 : renvoie un message de succes.
- Lignes 211 a 213 : gerent les erreurs.
- Ligne 214 : ferme la route.

Grace au `onDelete: Cascade` dans Prisma, les inscriptions liees sont supprimees aussi.

### Lignes 216 a 278 : route `POST /inscriptions`

- Ligne 214 : commentaire.
- Ligne 215 : cree la route d'inscription.
- Ligne 215 : reserve la route au role `etudiant`.
- Ligne 216 : lit `etudiant_id` depuis le body.
- Ligne 217 : lit `formation_id` depuis le body.
- Lignes 219 a 223 : verifient que les deux ids existent.
- Ligne 225 : commence le `try`.
- Ligne 226 : cherche l'etudiant.
- Lignes 227 a 230 : verifie l'id et le role `etudiant`.
- Ligne 233 : cherche la formation.
- Ligne 234 : cherche par id de formation.
- Lignes 237 a 241 : renvoie `404` si l'etudiant n'existe pas.
- Lignes 243 a 247 : renvoie `404` si la formation n'existe pas.
- Ligne 249 : cherche si l'inscription existe deja.
- Lignes 250 a 253 : condition : meme etudiant et meme formation.
- Lignes 256 a 260 : refuse une double inscription.
- Ligne 262 : cree une nouvelle inscription.
- Lignes 263 a 266 : enregistre les deux ids.
- Lignes 269 a 272 : renvoie le succes et l'inscription.
- Lignes 273 a 275 : gerent les erreurs.
- Ligne 276 : ferme la route.

### Lignes 280 a 314 : route `GET /mes-inscriptions/:id`

- Ligne 278 : commentaire.
- Ligne 279 : cree la route pour voir les inscriptions d'un etudiant.
- Ligne 279 : reserve la route au role `etudiant`.
- Ligne 280 : lit l'id de l'etudiant depuis l'URL.
- Lignes 282 a 286 : refuse un id invalide.
- Ligne 288 : commence le `try`.
- Ligne 289 : demande les inscriptions a Prisma.
- Lignes 290 a 292 : filtre par `etudiantId`.
- Lignes 293 a 295 : inclut les informations de la formation.
- Lignes 296 a 298 : trie par id croissant.
- Ligne 303 : transforme le resultat.
- Lignes 304 a 307 : garde seulement `id`, `titre`, `duree`, `niveau`.
- Ligne 310 : renvoie le resultat.
- Lignes 311 a 313 : gerent les erreurs.
- Ligne 314 : ferme la route.

### Lignes 316 a 328 : demarrage du serveur

- Ligne 316 : declare `startServer`.
- Ligne 317 : commence le `try`.
- Ligne 318 : teste la connexion Prisma a MySQL.
- Ligne 320 : lance Express sur le port choisi.
- Ligne 321 : affiche l'URL dans le terminal.
- Ligne 323 : attrape une erreur de demarrage.
- Ligne 324 : affiche le message d'erreur.
- Ligne 326 : ferme la fonction.
- Ligne 328 : appelle la fonction pour demarrer le backend.

## `backend/package.json`

Role du fichier : declarer les dependances backend et les commandes npm.

- Ligne 1 : debut du JSON.
- Ligne 2 : nom du package.
- Ligne 3 : version du backend.
- Ligne 4 : description courte.
- Ligne 5 : fichier principal.
- Ligne 6 : debut des scripts.
- Ligne 7 : `npm start` lance `server.js`.
- Ligne 8 : `npm run setup` cree les tables Prisma puis lance le seed.
- Ligne 9 : `npm run seed` ajoute les donnees de test.
- Ligne 10 : `npm run studio` ouvre Prisma Studio sur `0.0.0.0:5555`, utile dans Docker.
- Ligne 11 : `npm test` verifie la syntaxe de `server.js`.
- Ligne 12 : fin des scripts.
- Ligne 13 : mots-cles vides.
- Ligne 14 : auteur vide.
- Ligne 15 : licence.
- Ligne 16 : utilise CommonJS avec `require`.
- Ligne 17 : debut des dependances de production.
- Ligne 18 : client Prisma utilise dans `server.js`.
- Ligne 19 : CORS.
- Ligne 20 : variables `.env`.
- Ligne 21 : Express.
- Ligne 22 : fin des dependances.
- Ligne 23 : debut des dependances de developpement.
- Ligne 24 : CLI Prisma pour `db push`, `generate`, `studio`.
- Lignes 25 a 26 : fermeture du JSON.

## `backend/prisma/schema.prisma`

Role du fichier : decrire les tables de la base MySQL.

- Ligne 1 : debut du generateur Prisma.
- Ligne 2 : demande a Prisma de generer un client JavaScript.
- Ligne 3 : fin du generateur.
- Ligne 5 : debut de la source de donnees.
- Ligne 6 : la base est MySQL.
- Ligne 7 : l'URL de connexion vient de `DATABASE_URL`.
- Ligne 8 : fin de la source de donnees.
- Ligne 10 : debut du modele `User`.
- Ligne 11 : id entier, cle primaire, auto-increment.
- Ligne 12 : nom de l'utilisateur.
- Ligne 13 : prenom de l'utilisateur.
- Ligne 14 : email unique.
- Ligne 15 : mot de passe simple pour le TP.
- Ligne 16 : role simple : `admin` ou `etudiant`.
- Ligne 17 : liste des inscriptions de cet utilisateur.
- Ligne 19 : nom reel de table MySQL : `users`.
- Ligne 20 : fin du modele `User`.
- Ligne 22 : debut du modele `Formation`.
- Ligne 23 : id auto-increment.
- Ligne 24 : titre de la formation.
- Ligne 25 : duree de la formation.
- Ligne 26 : niveau de la formation, avec `Debutant` comme valeur par defaut.
- Ligne 27 : inscriptions liees a cette formation.
- Ligne 29 : nom reel de table MySQL : `formations`.
- Ligne 30 : fin du modele `Formation`.
- Ligne 32 : debut du modele `Inscription`.
- Ligne 33 : id auto-increment.
- Ligne 34 : id de l'etudiant, stocke en base comme `etudiant_id`.
- Ligne 35 : id de la formation, stocke comme `formation_id`.
- Ligne 36 : relation vers `User`, suppression en cascade.
- Ligne 37 : relation vers `Formation`, suppression en cascade.
- Ligne 39 : empeche un etudiant de s'inscrire deux fois a la meme formation.
- Ligne 40 : nom reel de table MySQL : `inscriptions`.
- Ligne 41 : fin du modele.

## `backend/prisma/seed.js`

Role du fichier : remplir la base avec des donnees de test.

- Ligne 1 : charge `.env`.
- Ligne 3 : importe Prisma.
- Ligne 5 : cree le client Prisma.
- Ligne 7 : declare la fonction principale.
- Ligne 8 : cree ou retrouve l'admin avec `upsert`.
- Ligne 9 : cherche l'admin par email.
- Ligne 10 : ne modifie rien si l'admin existe deja.
- Lignes 11 a 17 : donnees de creation de l'admin.
- Ligne 18 : fin du `upsert` admin.
- Ligne 20 : cree ou retrouve l'etudiant.
- Ligne 21 : cherche par email.
- Ligne 22 : ne modifie rien si l'etudiant existe deja.
- Lignes 23 a 29 : donnees de creation de l'etudiant.
- Ligne 30 : fin du `upsert` etudiant.
- Ligne 32 : compte le nombre de formations.
- Ligne 34 : si aucune formation n'existe.
- Ligne 35 : cree plusieurs formations.
- Lignes 36 a 47 : tableau des formations de test avec titre, duree et niveau.
- Ligne 48 : fin de `createMany`.
- Ligne 49 : fin du `if`.
- Ligne 51 : cherche la premiere formation.
- Ligne 52 : trie par id croissant.
- Ligne 53 : fin de la recherche.
- Ligne 55 : verifie qu'une formation existe.
- Ligne 56 : cree ou retrouve l'inscription de test.
- Lignes 57 a 62 : cherche l'inscription avec la cle unique composee.
- Ligne 63 : ne modifie rien si elle existe deja.
- Lignes 64 a 67 : cree l'inscription de Ali dans la premiere formation.
- Ligne 68 : fin du `upsert`.
- Ligne 69 : fin du `if`.
- Lignes 71 a 73 : affiche les comptes dans le terminal.
- Ligne 74 : fin de `main`.
- Ligne 76 : lance `main`.
- Lignes 77 a 80 : affiche l'erreur et stoppe le script si probleme.
- Lignes 81 a 83 : ferme toujours la connexion Prisma.

## `backend/.env.example`

Role du fichier : exemple de variables d'environnement.

- Ligne 1 : URL MySQL locale, avec root/root, port `3307`, base `gestion_etudiants`.
- Ligne 2 : port du backend.

Le vrai fichier `.env` n'est pas versionne car il peut contenir des secrets.

## `backend/.dockerignore`

Role du fichier : eviter d'envoyer des fichiers inutiles dans l'image Docker.

- Ligne 1 : ignore `node_modules`.
- Ligne 2 : ignore les logs npm.
- Ligne 3 : ignore `.env`.

## `backend/.gitignore`

Role du fichier : dire a Git quels fichiers backend ne doivent pas etre suivis.

- Ligne 1 : ignore `node_modules/`, car les dependances se reinstallent avec `npm install`.
- Ligne 2 : ignore les fichiers de log.
- Ligne 3 : ignore `.env`, car il peut contenir des informations locales ou sensibles.

## `backend/README.md`

Role du fichier : documentation rapide du backend.

- Lignes 1 a 14 : presentation du backend et des technologies.
- Lignes 16 a 22 : liste des fonctionnalites.
- Lignes 24 a 36 : structure importante.
- Lignes 38 a 64 : lancement avec Docker, URLs et commandes d'arret.
- Lignes 66 a 80 : Prisma Studio.
- Lignes 82 a 115 : lancement sans Docker.
- Lignes 117 a 133 : comptes de test.
- Lignes 135 a 240 : routes HTTP et exemples.
- Lignes 242 a 249 : pourquoi le backend reste simple pour debutant.
