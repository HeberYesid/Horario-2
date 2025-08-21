const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API del Sistema de Horarios funcionando correctamente!' });
});

// Ruta para probar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Conexión a la base de datos exitosa',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ 
      error: 'Error de conexión a la base de datos',
      details: error.message 
    });
  }
});

// Ruta para verificar las migraciones
app.get('/api/check-migrations', async (req, res) => {
  try {
    // Verificar tabla subjects
    const subjectsTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'subjects'
      );
    `);
    
    // Verificar columna subject_id en schedules
    const subjectIdColumn = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'schedules' 
        AND column_name = 'subject_id'
      );
    `);
    
    // Contar materias existentes
    let subjectsCount = 0;
    if (subjectsTable.rows[0].exists) {
      const count = await pool.query('SELECT COUNT(*) FROM subjects');
      subjectsCount = parseInt(count.rows[0].count);
    }
    
    res.json({
      migrations: {
        subjects_table_exists: subjectsTable.rows[0].exists,
        subject_id_column_exists: subjectIdColumn.rows[0].exists,
        subjects_count: subjectsCount
      },
      status: subjectsTable.rows[0].exists && subjectIdColumn.rows[0].exists ? 'ready' : 'pending'
    });
  } catch (error) {
    console.error('Error al verificar migraciones:', error);
    res.status(500).json({ 
      error: 'Error al verificar migraciones',
      details: error.message 
    });
  }
});

// Rutas API
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/subjects', require('./routes/subjects'));

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

module.exports = { app };
