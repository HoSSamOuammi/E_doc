require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      nom: "Admin",
      prenom: "Systeme",
      email: "admin@gmail.com",
      password: "123456",
      role: "admin",
    },
  });

  const etudiant = await prisma.user.upsert({
    where: { email: "ali@gmail.com" },
    update: {},
    create: {
      nom: "Ali",
      prenom: "Benali",
      email: "ali@gmail.com",
      password: "123456",
      role: "etudiant",
    },
  });

  const totalFormations = await prisma.formation.count();

  if (totalFormations === 0) {
    await prisma.formation.createMany({
      data: [
        {
          titre: "Developpement Web",
          duree: "3 mois",
          niveau: "Debutant",
        },
        {
          titre: "MySQL debutant",
          duree: "2 mois",
          niveau: "Debutant",
        },
      ],
    });
  }

  const premiereFormation = await prisma.formation.findFirst({
    orderBy: { id: "asc" },
  });

  if (premiereFormation) {
    await prisma.inscription.upsert({
      where: {
        etudiantId_formationId: {
          etudiantId: etudiant.id,
          formationId: premiereFormation.id,
        },
      },
      update: {},
      create: {
        etudiantId: etudiant.id,
        formationId: premiereFormation.id,
      },
    });
  }

  console.log("Donnees de test ajoutees.");
  console.log(`Admin: ${admin.email} / 123456`);
  console.log(`Etudiant: ${etudiant.email} / 123456`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
