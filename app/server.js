const express = require("express");
const path = require("path");
const { Pool } = require("pg");

// El host de la base de datos es el NOMBRE DEL SERVICIO en docker-compose.yml ("db").
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Leer: app -> db -> app
app.get("/api/mascotas", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, nombre, tipo, edad FROM mascotas ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo leer de la base de datos" });
  }
});

// Guardar: app -> db -> app
app.post("/api/mascotas", async (req, res) => {
  const { nombre, tipo, edad } = req.body;
  if (!nombre || !tipo) {
    return res.status(400).json({ error: "nombre y tipo son obligatorios" });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO mascotas (nombre, tipo, edad) VALUES ($1, $2, $3) RETURNING id, nombre, tipo, edad",
      [nombre, tipo, edad || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo guardar en la base de datos" });
  }
});

app.listen(3000, () => console.log("App escuchando en el puerto 3000"));
