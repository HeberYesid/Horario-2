const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Ruta de prueba para verificar la estructura de la base de datos
router.get('/test-db-structure', async (req, res) => {
  try {
    // Verificar columnas de la tabla schedules
    const scheduleColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'schedules' 
      ORDER BY ordinal_position;
    `);
    
    // Verificar si existe la tabla subjects
    const subjectsExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'subjects'
      );
    `);
    
    // Contar registros en subjects si existe
    let subjectsCount = 0;
    if (subjectsExists.rows[0].exists) {
      const count = await pool.query('SELECT COUNT(*) FROM subjects');
      subjectsCount = parseInt(count.rows[0].count);
    }
    
    res.json({
      schedules_columns: scheduleColumns.rows,
      subjects_table_exists: subjectsExists.rows[0].exists,
      subjects_count: subjectsCount
    });
  } catch (error) {
    console.error('Error verificando estructura:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los horarios del usuario (protegido)
router.get('/', auth, async (req, res) => {
  try {
    const schedules = await pool.query(`
      SELECT 
        s.id, s.user_id, s.subject_id, s.description, s.day_of_week, 
        s.start_time, s.end_time, s.location, s.created_at, s.updated_at,
        sub.name as subject_name, sub.color as subject_color
      FROM schedules s
      JOIN subjects sub ON s.subject_id = sub.id
      WHERE s.user_id = $1 
      ORDER BY s.day_of_week, s.start_time
    `, [req.user.userId]);
    
    res.json(schedules.rows);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo horario (protegido)
router.post('/', auth, async (req, res) => {
  try {
    const { subject_id, description, day_of_week, start_time, end_time, location } = req.body;
    
    console.log('Datos recibidos:', req.body); // Debug

    // Validar que subject_id esté presente
    if (!subject_id) {
      return res.status(400).json({ error: 'El campo subject_id es obligatorio' });
    }

    // Verificar que la materia existe
    const subjectExists = await pool.query('SELECT id FROM subjects WHERE id = $1', [subject_id]);
    if (subjectExists.rows.length === 0) {
      return res.status(400).json({ error: 'La materia seleccionada no existe' });
    }
    
    const newSchedule = await pool.query(`
      INSERT INTO schedules (user_id, subject_id, description, day_of_week, start_time, end_time, location) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `, [req.user.userId, subject_id, description, day_of_week, start_time, end_time, location]);
    
    // Obtener el horario con información de la materia
    const scheduleWithSubject = await pool.query(`
      SELECT 
        s.*, sub.name as subject_name, sub.color as subject_color
      FROM schedules s
      JOIN subjects sub ON s.subject_id = sub.id
      WHERE s.id = $1
    `, [newSchedule.rows[0].id]);
    
    res.status(201).json({
      message: 'Horario creado exitosamente',
      schedule: scheduleWithSubject.rows[0]
    });
  } catch (error) {
    console.error('Error al crear horario:', error);
    
    // Verificar si es un error de tabla no existente
    if (error.code === '42P01') {
      return res.status(500).json({ 
        error: 'La tabla subjects no existe. Por favor ejecuta las migraciones de la base de datos.' 
      });
    }
    
    // Verificar si es un error de columna no existente
    if (error.code === '42703') {
      return res.status(500).json({ 
        error: 'La columna subject_id no existe en la tabla schedules. Por favor ejecuta las migraciones.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// Actualizar horario (protegido)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, description, day_of_week, start_time, end_time, location } = req.body;
    
    // Verificar que la materia existe
    const subjectExists = await pool.query('SELECT id FROM subjects WHERE id = $1', [subject_id]);
    if (subjectExists.rows.length === 0) {
      return res.status(400).json({ error: 'La materia seleccionada no existe' });
    }
    
    const updatedSchedule = await pool.query(`
      UPDATE schedules 
      SET subject_id = $1, description = $2, day_of_week = $3, start_time = $4, end_time = $5, location = $6 
      WHERE id = $7 AND user_id = $8 
      RETURNING *
    `, [subject_id, description, day_of_week, start_time, end_time, location, id, req.user.userId]);
    
    if (updatedSchedule.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    
    // Obtener el horario con información de la materia
    const scheduleWithSubject = await pool.query(`
      SELECT 
        s.*, sub.name as subject_name, sub.color as subject_color
      FROM schedules s
      JOIN subjects sub ON s.subject_id = sub.id
      WHERE s.id = $1
    `, [id]);
    
    res.json({
      message: 'Horario actualizado exitosamente',
      schedule: scheduleWithSubject.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar horario (protegido)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedSchedule = await pool.query(
      'DELETE FROM schedules WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );
    
    if (deletedSchedule.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    
    res.json({
      message: 'Horario eliminado exitosamente',
      schedule: deletedSchedule.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
