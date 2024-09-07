const express = require('express');
const router = express.Router();

// Ruta para obtener categorías
router.get('/categorias', (req, res) => {
  req.db.promise().query('SELECT * FROM categorias')
    .then(([rows]) => {
      res.json(rows);
    })
    .catch(error => {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({ error: 'Error al obtener categorías' });
    });
});

// Ruta para agregar una transacción
router.post('/transaccion', (req, res) => {
  const { tipo, categoria_id, monto, fecha, moneda } = req.body;
  const query = 'INSERT INTO transacciones (tipo, categoria_id, monto, fecha, moneda) VALUES (?, ?, ?, ?, ?)';
  req.db.promise().query(query, [tipo, categoria_id, monto, fecha, moneda])
    .then(() => {
      res.status(201).send('Transacción agregada');
    })
    .catch(error => {
      console.error('Error al agregar transacción:', error);
      res.status(500).json({ error: 'Error al agregar transacción' });
    });
});

// Ruta para obtener el total actual
router.get('/total', (req, res) => {
  const query = `
    SELECT 
      COALESCE(SUM(CASE WHEN tipo = 'ingreso' AND moneda = 'pesos' THEN monto ELSE 0 END) -
      SUM(CASE WHEN tipo = 'gasto' AND moneda = 'pesos' THEN monto ELSE 0 END), 0) AS totalPesos,
      COALESCE(SUM(CASE WHEN tipo = 'ingreso' AND moneda = 'dolares' THEN monto ELSE 0 END) -
      SUM(CASE WHEN tipo = 'gasto' AND moneda = 'dolares' THEN monto ELSE 0 END), 0) AS totalDolares
    FROM transacciones;
  `;
  req.db.promise().query(query)
    .then(([result]) => {
      console.log('Resultado de la consulta de total:', result[0]); // Para depuración
      res.json({
        totalPesos: parseFloat(result[0].totalPesos) || 0,
        totalDolares: parseFloat(result[0].totalDolares) || 0
      });
    })
    .catch(error => {
      console.error('Error en la consulta de total:', error);
      res.status(500).json({ error: 'Error al calcular el total' });
    });
});

// Ruta para obtener todas las transacciones
router.get('/transacciones', (req, res) => {
  req.db.promise().query('SELECT * FROM transacciones')
    .then(([rows]) => {
      res.json(rows);
    })
    .catch(error => {
      console.error('Error al obtener transacciones:', error);
      res.status(500).json({ error: 'Error al obtener transacciones' });
    });
});

// Ruta para agregar una categoría
router.post('/categoria', (req, res) => {
  const { nombre } = req.body;
  const query = 'INSERT INTO categorias (nombre) VALUES (?)';
  req.db.promise().query(query, [nombre])
    .then(([result]) => {
      res.status(201).json({ message: 'Categoría agregada', id: result.insertId });
    })
    .catch(error => {
      console.error('Error al agregar categoría:', error);
      res.status(500).json({ error: 'Error al agregar categoría' });
    });
});

module.exports = router;
