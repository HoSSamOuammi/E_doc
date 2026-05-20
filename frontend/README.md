# Frontend E-doc

Interface Vue simple pour le projet E-doc.

Le frontend reste volontairement leger: il contient seulement les vues utiles
pour presenter la navigation entre connexion, espace admin, formations et
inscriptions etudiant.

## Pourquoi Vue et Vite

- Vue est utilise pour decouper l'interface en composants et vues.
- Vue Router est utilise pour avoir plusieurs pages sans recharger le site.
- Vite est utilise parce qu'il lance rapidement le projet en developpement.
- Pinia a ete retire car aucun store global n'est encore utilise.

## Structure

```text
frontend/
  index.html
  package.json
  vite.config.js
  src/
    main.js
    App.vue
    style.css
    router/
      index.js
    views/
      LoginView.vue
      AdminFormationsView.vue
      StudentFormationsView.vue
      MyFormationView.vue
```

## Commandes

```bash
npm install
npm run dev
npm run build
```
