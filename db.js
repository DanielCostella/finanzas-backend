const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',      // Nombre del host
  user: 'root',           // Usuario de MySQL
  password: '',           // Contraseña del usuario, en este caso vacía
  database: 'finanzas',   // Nombre de la base de datos
  port: 3306              // Puerto donde corre MySQL (por defecto 3306)
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

module.exports = db;