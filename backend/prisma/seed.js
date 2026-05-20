require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.inscription.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        nom: "Admin",
        prenom: "Systeme",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin",
      },
      {
        nom: "Ali",
        prenom: "Benali",
        email: "ali@gmail.com",
        password: "123456",
        role: "etudiant",
      },
    ],
  });

  await prisma.formation.createMany({
    data: [
      {
        titre: "Developpement Web",
        duree: "3 mois",
      },
      {
        titre: "MySQL debutant",
        duree: "2 mois",
      },
    ],
  });

  console.log("Donnees de test ajoutees avec succes.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
