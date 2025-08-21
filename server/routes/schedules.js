const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtener todos los horarios del usuario (protegido)
router.get('/', auth, async (req, res) => {
  try {
    const schedules = await pool.query(
      'SELECT * FROM schedules WHERE user_id = $1 ORDER BY day_of_week, start_time',
      [req.user.userId]
    );
    res.json(schedules.rows);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo horario (protegido)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, day_of_week, start_time, end_time, location } = req.body;
    
    const newSchedule = await pool.query(
      'INSERT INTO schedules (user_id, title, description, day_of_week, start_time, end_time, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.userId, title, description, day_of_week, start_time, end_time, location]
    );
    
    res.status(201).json({
      message: 'Horario creado exitosamente',
      schedule: newSchedule.rows[0]
    });
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar horario (protegido)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, day_of_week, start_time, end_time, location } = req.body;
    
    const updatedSchedule = await pool.query(
      'UPDATE schedules SET title = $1, description = $2, day_of_week = $3, start_time = $4, end_time = $5, location = $6 WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, description, day_of_week, start_time, end_time, location, id, req.user.userId]
    );
    
    if (updatedSchedule.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    
    res.json({
      message: 'Horario actualizado exitosamente',
      schedule: updatedSchedule.rows[0]
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
