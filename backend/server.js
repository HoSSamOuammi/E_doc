require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

function erreurServeur(res, error) {
  res.status(500).json({
    message: "Erreur serveur.",
    error: error.message,
  });
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
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email et password sont obligatoires.",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email ou password incorrect.",
      });
    }

    res.json({
      message: "Connexion reussie.",
      user: cacherPassword(user),
    });
  } catch (error) {
    erreurServeur(res, error);
  }
});

// Tous les utilisateurs peuvent voir les formations.
app.get("/formations", async (req, res) => {
  try {
    const formations = await prisma.formation.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(formations);
  } catch (error) {
    erreurServeur(res, error);
  }
});

// Admin: ajouter une formation.
app.post("/formations", verifierRole("admin"), async (req, res) => {
  const { titre, duree } = req.body;

  if (!titre || !duree) {
    return res.status(400).json({
      message: "Titre et duree sont obligatoires.",
    });
  }

  try {
    const formation = await prisma.formation.create({
      data: {
        titre,
        duree,
      },
    });

    res.status(201).json({
      message: "Formation ajoutee avec succes.",
      formation,
    });
  } catch (error) {
    erreurServeur(res, error);
  }
});

// Admin: modifier une formation.
app.put("/formations/:id", verifierRole("admin"), async (req, res) => {
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

  try {
    const formation = await prisma.formation.findUnique({
      where: { id },
    });

    if (!formation) {
      return res.status(404).json({
        message: "Formation non trouvee.",
      });
    }

    const formationModifiee = await prisma.formation.update({
      where: { id },
      data: {
        titre,
        duree,
      },
    });

    res.json({
      message: "Formation modifiee avec succes.",
      formation: formationModifiee,
    });
  } catch (error) {
    erreurServeur(res, error);
  }
});

// Admin: supprimer une formation.
app.delete("/formations/:id", verifierRole("admin"), async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Id de formation invalide.",
    });
  }

  try {
    const formation = await prisma.formation.findUnique({
      where: { id },
    });

    if (!formation) {
      return res.status(404).json({
        message: "Formation non trouvee.",
      });
    }

    await prisma.formation.delete({
      where: { id },
    });

    res.json({
      message: "Formation supprimee avec succes.",
    });
  } catch (error) {
    erreurServeur(res, error);
  }
});

// Etudiant: s'inscrire a une formation.
app.post("/inscriptions", verifierRole("etudiant"), async (req, res) => {
  const etudiantId = Number(req.body.etudiant_id);
  const formationId = Number(req.body.formation_id);

  if (!etudiantId || !formationId) {
    return res.status(400).json({
      message: "etudiant_id et formation_id sont obligatoires.",
    });
  }

  try {
    const etudiant = await prisma.user.findFirst({
      where: {
        id: etudiantId,
        role: "etudiant",
      },
    });

    const formation = await prisma.formation.findUnique({
      where: { id: formationId },
    });

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

    const dejaInscrit = await prisma.inscription.findFirst({
      where: {
        etudiantId,
        formationId,
      },
    });

    if (dejaInscrit) {
      return res.status(400).json({
        message: "Cet etudiant est deja inscrit a cette formation.",
      });
    }

    const inscription = await prisma.inscription.create({
      data: {
        etudiantId,
        formationId,
      },
    });

    res.status(201).json({
      message: "Inscription ajoutee avec succes.",
      inscription,
    });
  } catch (error) {
    erreurServeur(res, error);
  }
});

// Etudiant: afficher ses inscriptions.
app.get("/mes-inscriptions/:id", verifierRole("etudiant"), async (req, res) => {
  const etudiantId = Number(req.params.id);

  if (!etudiantId) {
    return res.status(400).json({
      message: "Id etudiant invalide.",
    });
  }

  try {
    const inscriptions = await prisma.inscription.findMany({
      where: {
        etudiantId,
      },
      include: {
        formation: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const resultat = inscriptions.map((inscription) => ({
      id: inscription.id,
      titre: inscription.formation.titre,
      duree: inscription.formation.duree,
    }));

    res.json(resultat);
  } catch (error) {
    erreurServeur(res, error);
  }
});

async function startServer() {
  try {
    await prisma.$connect();

    app.listen(PORT, () => {
      console.log(`Serveur lance sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Impossible de demarrer le serveur :", error.message);
  }
}

startServer();
