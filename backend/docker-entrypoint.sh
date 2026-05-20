#!/bin/sh
set -e

echo "Preparation de la base de donnees..."
npx prisma db push
npm run seed

echo "Demarrage du serveur..."
npm start
