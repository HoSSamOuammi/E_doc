const test = require("node:test");
const assert = require("node:assert/strict");
const { creerApp } = require("./server");

function demarrerServeur(t) {
  return new Promise((resolve) => {
    const app = creerApp();
    const server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();

      t.after(() => {
        server.close();
      });

      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
  });
}

async function requete(baseUrl, chemin, options = {}) {
  const headers = {};

  if (options.body) {
    headers["content-type"] = "application/json";
  }

  if (options.role) {
    headers.role = options.role;
  }

  const response = await fetch(`${baseUrl}${chemin}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = await response.json();

  return {
    status: response.status,
    body,
  };
}

test("GET / retourne les routes principales", async (t) => {
  const { baseUrl } = await demarrerServeur(t);
  const response = await requete(baseUrl, "/");

  assert.equal(response.status, 200);
  assert.equal(response.body.message, "API E-doc en marche.");
  assert.ok(response.body.routes.includes("POST /login"));
});

test("POST /login connecte un utilisateur sans renvoyer le password", async (t) => {
  const { baseUrl } = await demarrerServeur(t);

  const response = await requete(baseUrl, "/login", {
    method: "POST",
    body: {
      email: "admin@gmail.com",
      password: "123456",
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.user.role, "admin");
  assert.equal(response.body.user.password, undefined);
});

test("POST /login refuse les mauvais identifiants", async (t) => {
  const { baseUrl } = await demarrerServeur(t);

  const response = await requete(baseUrl, "/login", {
    method: "POST",
    body: {
      email: "admin@gmail.com",
      password: "mauvais",
    },
  });

  assert.equal(response.status, 401);
});

test("un admin peut ajouter, modifier puis supprimer une formation", async (t) => {
  const { baseUrl } = await demarrerServeur(t);

  const sansRole = await requete(baseUrl, "/formations", {
    method: "POST",
    body: {
      titre: "JavaScript",
      duree: "4 semaines",
      niveau: "Debutant",
    },
  });
  assert.equal(sansRole.status, 403);

  const creation = await requete(baseUrl, "/formations", {
    method: "POST",
    role: "admin",
    body: {
      titre: "JavaScript",
      duree: "4 semaines",
      niveau: "Debutant",
    },
  });
  assert.equal(creation.status, 201);

  const formationId = creation.body.formation.id;
  const modification = await requete(baseUrl, `/formations/${formationId}`, {
    method: "PUT",
    role: "admin",
    body: {
      titre: "JavaScript avance",
      duree: "6 semaines",
      niveau: "Intermediaire",
    },
  });
  assert.equal(modification.status, 200);
  assert.equal(modification.body.formation.titre, "JavaScript avance");
  assert.equal(modification.body.formation.niveau, "Intermediaire");

  const suppression = await requete(baseUrl, `/formations/${formationId}`, {
    method: "DELETE",
    role: "admin",
  });
  assert.equal(suppression.status, 200);
});

test("un etudiant voit ses inscriptions et ne peut pas dupliquer une inscription", async (t) => {
  const { baseUrl } = await demarrerServeur(t);

  const inscriptions = await requete(baseUrl, "/mes-inscriptions/2", {
    role: "etudiant",
  });
  assert.equal(inscriptions.status, 200);
  assert.equal(inscriptions.body[0].titre, "Developpement Web");
  assert.equal(inscriptions.body[0].niveau, "Debutant");

  const doublon = await requete(baseUrl, "/inscriptions", {
    method: "POST",
    role: "etudiant",
    body: {
      etudiant_id: 2,
      formation_id: 1,
    },
  });
  assert.equal(doublon.status, 400);
});
