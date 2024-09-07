const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const rutas = require('./rutas');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'finanzas'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Termina el proceso si no se puede conectar a la base de datos
  }
  console.log('Conectado a la base de datos');
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(rutas);

app.get('/', (req, res) => {
  res.send('Bienvenido al backend de Finanzas');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});