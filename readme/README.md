# Documentation du projet E-doc

Ce dossier contient la documentation detaillee du projet.

Ordre conseille de lecture :

1. [01-setup-run.md](01-setup-run.md) : installation, lancement, arret, reset, Prisma Studio.
2. [02-backend-line-by-line.md](02-backend-line-by-line.md) : explication du backend fichier par fichier.
3. [03-docker-prisma-line-by-line.md](03-docker-prisma-line-by-line.md) : explication de Docker, Prisma et MySQL.
4. [04-frontend-line-by-line.md](04-frontend-line-by-line.md) : explication du frontend fichier par fichier.
5. [05-generated-assets.md](05-generated-assets.md) : explication des fichiers generes, images et SVG.
6. [06-all-files-checklist.md](06-all-files-checklist.md) : checklist de couverture de tous les fichiers.

## Idee generale du projet

E-doc est une petite application etudiante de gestion de formations.

Le backend permet de :

- se connecter avec un compte admin ou etudiant
- afficher les formations
- ajouter, modifier et supprimer une formation avec le role admin
- inscrire un etudiant a une formation
- afficher les inscriptions d'un etudiant

Le frontend contient les premieres pages Vue :

- login
- espace admin
- liste des formations etudiant
- formation inscrite

L'infrastructure Docker lance :

- MySQL pour la base de donnees
- le backend Express
- Prisma Studio pour voir les tables dans le navigateur

## Fichiers principaux

```text
docker-compose.yml
backend/
  server.js
  package.json
  Dockerfile
  docker-entrypoint.sh
  prisma/
    schema.prisma
    seed.js
frontend/
  src/
    main.js
    App.vue
    router/index.js
    views/
```

## Remarque importante

Les fichiers `package-lock.json`, les images et les SVG sont des fichiers generes ou des assets.
Ils sont documentes dans [05-generated-assets.md](05-generated-assets.md), mais ils ne sont pas utiles a expliquer ligne par ligne comme du code metier.
