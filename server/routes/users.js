const express = require('express');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtener todos los usuarios (protegido)
router.get('/', auth, async (req, res) => {
  try {
    const users = await pool.query('SELECT id, name, email, education_level, created_at FROM users');
    res.json(users.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener perfil de usuario (protegido)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, education_level, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar perfil de usuario (protegido)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, educationLevel } = req.body;
    
    // Validar el nivel de educación si se proporciona
    const validEducationLevels = ['transicion', 'primaria', 'bachillerato'];
    if (educationLevel && !validEducationLevels.includes(educationLevel)) {
      return res.status(400).json({ error: 'Nivel de educación no válido' });
    }
    
    const updatedUser = await pool.query(
      'UPDATE users SET name = $1, email = $2, education_level = $3 WHERE id = $4 RETURNING id, name, email, education_level',
      [name, email, educationLevel || null, req.user.userId]
    );
    
    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
