const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtener todas las materias
router.get('/', async (req, res) => {
  try {
    const subjects = await pool.query(
      'SELECT id, name, description, color FROM subjects ORDER BY name'
    );
    res.json(subjects.rows);
  } catch (error) {
    console.error('Error al obtener materias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva materia (protegido - solo para administradores si decides implementar roles)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const newSubject = await pool.query(
      'INSERT INTO subjects (name, description, color) VALUES ($1, $2, $3) RETURNING *',
      [name, description, color || '#95A5A6']
    );
    
    res.status(201).json({
      message: 'Materia creada exitosamente',
      subject: newSubject.rows[0]
    });
  } catch (error) {
    console.error('Error al crear materia:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Ya existe una materia con ese nombre' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// Actualizar materia (protegido)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    
    const updatedSubject = await pool.query(
      'UPDATE subjects SET name = $1, description = $2, color = $3 WHERE id = $4 RETURNING *',
      [name, description, color, id]
    );
    
    if (updatedSubject.rows.length === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    res.json({
      message: 'Materia actualizada exitosamente',
      subject: updatedSubject.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar materia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar materia (protegido)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay horarios que usan esta materia
    const scheduleCount = await pool.query(
      'SELECT COUNT(*) FROM schedules WHERE subject_id = $1',
      [id]
    );
    
    if (parseInt(scheduleCount.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la materia porque tiene horarios asociados' 
      });
    }
    
    const deletedSubject = await pool.query(
      'DELETE FROM subjects WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (deletedSubject.rows.length === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    res.json({
      message: 'Materia eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar materia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
