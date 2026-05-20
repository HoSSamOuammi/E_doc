CREATE DATABASE IF NOT EXISTS gestion_etudiants;
USE gestion_etudiants;

DROP TABLE IF EXISTS inscriptions;
DROP TABLE IF EXISTS formations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL
);

CREATE TABLE formations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(150) NOT NULL,
  duree VARCHAR(100) NOT NULL
);

CREATE TABLE inscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  etudiant_id INT NOT NULL,
  formation_id INT NOT NULL,
  UNIQUE (etudiant_id, formation_id),
  FOREIGN KEY (etudiant_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

INSERT INTO users (nom, prenom, email, password, role) VALUES
('Admin', 'Systeme', 'admin@gmail.com', '123456', 'admin'),
('Ali', 'Benali', 'ali@gmail.com', '123456', 'etudiant');

INSERT INTO formations (titre, duree) VALUES
('Developpement Web', '3 mois'),
('MySQL debutant', '2 mois');
