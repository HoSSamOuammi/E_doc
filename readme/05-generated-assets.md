# Fichiers generes et assets

Certains fichiers du projet ne sont pas du code ecrit a la main.
Ils sont quand meme importants, mais il ne faut pas les apprendre ligne par ligne.

## `backend/package-lock.json`

Role du fichier : verrouiller les versions exactes des dependances backend.

Ce fichier est genere automatiquement par npm.
Il est modifie quand on lance :

```bash
npm install
```

Il sert a garantir que tout le monde installe les memes versions.

Structure generale :

- debut du fichier : nom du projet, version, version du lockfile
- section `packages` : liste les packages installes
- chaque package contient souvent :
  - `version`
  - `resolved`
  - `integrity`
  - `dependencies`
  - `engines`

Pourquoi on ne l'explique pas ligne par ligne :

- il est tres long
- il est genere automatiquement
- il ne contient pas de logique metier
- il ne faut pas le modifier a la main

Ce qu'il faut savoir pour l'expliquer a l'oral :

> `package-lock.json` bloque les versions exactes des dependances pour que le projet marche pareil sur toutes les machines.

## `frontend/package-lock.json`

Role du fichier : meme role que le lockfile backend, mais pour le frontend.

Il verrouille les versions de :

- Vue
- Vite
- Pinia
- Vue Router
- les dependances internes de ces outils

Il ne faut pas le modifier a la main.
Si on ajoute une dependance frontend, npm le mettra a jour.

## `frontend/public/favicon.svg`

Role du fichier : icone affichee dans l'onglet du navigateur.

Le fichier est sur une seule ligne SVG.
Cette ligne contient :

- une balise `<svg>`
- des dimensions
- un `viewBox`
- un ou plusieurs chemins `<path>`
- des couleurs de remplissage

Ce fichier est reference dans :

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

dans `frontend/index.html`.

## `frontend/public/icons.svg`

Role du fichier : stocker plusieurs icones SVG reutilisables.

Ce fichier contient :

- un `<svg>` parent
- plusieurs `<symbol>`
- chaque symbole a un `id`

Exemples d'ids :

- `bluesky-icon`
- `discord-icon`
- `documentation-icon`
- `github-icon`
- `social-icon`
- `x-icon`

Dans `HelloWorld.vue`, une icone est utilisee comme ca :

```html
<use href="/icons.svg#documentation-icon"></use>
```

Explication :

- `/icons.svg` charge le fichier.
- `#documentation-icon` choisit le symbole dans le fichier.

## `frontend/src/assets/vite.svg`

Role du fichier : logo Vite.

Le fichier est un SVG sur une seule ligne.
Il est importe dans `HelloWorld.vue` :

```js
import viteLogo from '../assets/vite.svg'
```

Puis affiche avec :

```html
<img :src="viteLogo" class="vite" alt="Vite logo" />
```

## `frontend/src/assets/vue.svg`

Role du fichier : logo Vue.

Le fichier est un SVG sur une seule ligne.
Il est importe dans `HelloWorld.vue` :

```js
import vueLogo from '../assets/vue.svg'
```

Puis affiche avec :

```html
<img :src="vueLogo" class="framework" alt="Vue logo" />
```

## `frontend/src/assets/hero.png`

Role du fichier : image PNG utilisee dans le composant de demo.

Ce fichier est binaire.
Un fichier binaire ne se lit pas ligne par ligne comme un fichier `.js` ou `.vue`.

Il est importe dans `HelloWorld.vue` :

```js
import heroImg from '../assets/hero.png'
```

Puis affiche avec :

```html
<img :src="heroImg" class="base" width="170" height="179" alt="" />
```

## `node_modules`

Role du dossier : dependances installees par npm.

Il n'est pas versionne dans Git.
Il se recree avec :

```bash
npm install
```

Il ne faut pas l'expliquer fichier par fichier.
C'est du code externe installe depuis npm.

## `.env`

Role du fichier : variables d'environnement locales.

Il n'est pas versionne dans Git.
On garde seulement `.env.example`.

Exemple :

```env
DATABASE_URL="mysql://root:root@localhost:3307/gestion_etudiants"
PORT=5000
```

Pourquoi `.env` n'est pas versionne :

- il peut contenir des mots de passe
- chaque developpeur peut avoir une configuration differente
- Docker fournit deja ses variables dans `docker-compose.yml`
