const path = require("path");
const express = require("express");
const { dbConnection } = require("./databases/config");
const cors = require("cors");

require("dotenv").config();

// Crear aplicacion de Express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio publico
app.use(express.static("public"));

// Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", require("./routes/auth"));

app.use("/api/accounts", require("./routes/accounts"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/users", require("./routes/users"));
app.use("/api/profiles", require("./routes/profiles"));

app.use("*", (req, res) => {
  req.sendFile(path.join(__dirname, "public/index.html"));
});
// TODO: CRUD: Eventos
// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
