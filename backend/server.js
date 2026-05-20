const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Donnees simples en memoire.
// Elles reviennent a leur valeur de depart quand on redemarre le serveur.
const users = [
  {
    id: 1,
    nom: "Admin",
    prenom: "Systeme",
    email: "admin@gmail.com",
    password: "123456",
    role: "admin",
  },
  {
    id: 2,
    nom: "Ali",
    prenom: "Benali",
    email: "ali@gmail.com",
    password: "123456",
    role: "etudiant",
  },
];

let formations = [
  {
    id: 1,
    titre: "Developpement Web",
    duree: "3 mois",
  },
  {
    id: 2,
    titre: "MySQL debutant",
    duree: "2 mois",
  },
];

let inscriptions = [
  {
    id: 1,
    etudiantId: 2,
    formationId: 1,
  },
];

let prochainIdFormation = 3;
let prochainIdInscription = 2;

// Middleware tres simple: on envoie le role dans le header "role".
function verifierRole(roleAttendu) {
  return (req, res, next) => {
    const role = req.headers.role;

    if (role !== roleAttendu) {
      return res.status(403).json({
        message: `Acces refuse. Route reservee au role ${roleAttendu}.`,
      });
    }

    next();
  };
}

function cacherPassword(user) {
  return {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
  };
}

app.get("/", (req, res) => {
  res.json({
    message: "API E-doc en marche.",
    routes: [
      "POST /login",
      "GET /formations",
      "POST /formations",
      "PUT /formations/:id",
      "DELETE /formations/:id",
      "POST /inscriptions",
      "GET /mes-inscriptions/:id",
    ],
  });
});

// Connexion simple avec email et password.
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email et password sont obligatoires.",
    });
  }

  const user = users.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Email ou password incorrect.",
    });
  }

  res.json({
    message: "Connexion reussie.",
    user: cacherPassword(user),
  });
});

// Tous les utilisateurs peuvent voir les formations.
app.get("/formations", (req, res) => {
  res.json(formations);
});

// Admin: ajouter une formation.
app.post("/formations", verifierRole("admin"), (req, res) => {
  const { titre, duree } = req.body;

  if (!titre || !duree) {
    return res.status(400).json({
      message: "Titre et duree sont obligatoires.",
    });
  }

  const nouvelleFormation = {
    id: prochainIdFormation,
    titre,
    duree,
  };

  formations.push(nouvelleFormation);
  prochainIdFormation++;

  res.status(201).json({
    message: "Formation ajoutee avec succes.",
    formation: nouvelleFormation,
  });
});

// Admin: modifier une formation.
app.put("/formations/:id", verifierRole("admin"), (req, res) => {
  const id = Number(req.params.id);
  const { titre, duree } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Id de formation invalide.",
    });
  }

  if (!titre || !duree) {
    return res.status(400).json({
      message: "Titre et duree sont obligatoires.",
    });
  }

  const formation = formations.find((item) => item.id === id);

  if (!formation) {
    return res.status(404).json({
      message: "Formation non trouvee.",
    });
  }

  formation.titre = titre;
  formation.duree = duree;

  res.json({
    message: "Formation modifiee avec succes.",
    formation,
  });
});

// Admin: supprimer une formation.
app.delete("/formations/:id", verifierRole("admin"), (req, res) => {
  const id = Number(req.params.id);
  const formationExiste = formations.some((item) => item.id === id);

  if (!id) {
    return res.status(400).json({
      message: "Id de formation invalide.",
    });
  }

  if (!formationExiste) {
    return res.status(404).json({
      message: "Formation non trouvee.",
    });
  }

  formations = formations.filter((item) => item.id !== id);
  inscriptions = inscriptions.filter((item) => item.formationId !== id);

  res.json({
    message: "Formation supprimee avec succes.",
  });
});

// Etudiant: s'inscrire a une formation.
app.post("/inscriptions", verifierRole("etudiant"), (req, res) => {
  const etudiantId = Number(req.body.etudiant_id);
  const formationId = Number(req.body.formation_id);

  if (!etudiantId || !formationId) {
    return res.status(400).json({
      message: "etudiant_id et formation_id sont obligatoires.",
    });
  }

  const etudiant = users.find(
    (item) => item.id === etudiantId && item.role === "etudiant"
  );
  const formation = formations.find((item) => item.id === formationId);

  if (!etudiant) {
    return res.status(404).json({
      message: "Etudiant non trouve.",
    });
  }

  if (!formation) {
    return res.status(404).json({
      message: "Formation non trouvee.",
    });
  }

  const dejaInscrit = inscriptions.some(
    (item) => item.etudiantId === etudiantId && item.formationId === formationId
  );

  if (dejaInscrit) {
    return res.status(400).json({
      message: "Cet etudiant est deja inscrit a cette formation.",
    });
  }

  const nouvelleInscription = {
    id: prochainIdInscription,
    etudiantId,
    formationId,
  };

  inscriptions.push(nouvelleInscription);
  prochainIdInscription++;

  res.status(201).json({
    message: "Inscription ajoutee avec succes.",
    inscription: nouvelleInscription,
  });
});

// Etudiant: afficher ses inscriptions.
app.get("/mes-inscriptions/:id", verifierRole("etudiant"), (req, res) => {
  const etudiantId = Number(req.params.id);

  if (!etudiantId) {
    return res.status(400).json({
      message: "Id etudiant invalide.",
    });
  }

  const resultat = inscriptions
    .filter((item) => item.etudiantId === etudiantId)
    .map((inscription) => {
      const formation = formations.find(
        (item) => item.id === inscription.formationId
      );

      return {
        id: inscription.id,
        titre: formation.titre,
        duree: formation.duree,
      };
    });

  res.json(resultat);
});

app.listen(PORT, () => {
  console.log(`Serveur lance sur http://localhost:${PORT}`);
});
