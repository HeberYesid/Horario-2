import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminSubjects.css';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#95A5A6'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await axios.get('/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/subjects', formData);
      setMessage('Materia agregada exitosamente');
      resetForm();
      loadSubjects();
    } catch (error) {
      console.error('Error al agregar materia:', error);
      setMessage('Error al agregar materia: ' + (error.response?.data?.error || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
      return;
    }

    try {
      await axios.delete(`/api/subjects/${id}`);
      setMessage('Materia eliminada exitosamente');
      loadSubjects();
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      setMessage('Error al eliminar materia: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#95A5A6'
    });
    setShowForm(false);
  };

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#D7BDE2', '#D5DBDB', '#F39C12', '#3498DB', '#9B59B6',
    '#E74C3C', '#2ECC71', '#34495E', '#FF5733', '#C0392B', '#8E44AD'
  ];

  return (
    <div className="admin-subjects">
      <div className="admin-header">
        <h1>Administrar Materias 📚</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          ➕ Agregar Materia
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nueva Materia</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="subject-form">
              <div className="form-group">
                <label>Nombre de la materia</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Ej: Biología, Química, etc."
                />
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción opcional de la materia"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                  <span>Color seleccionado: {formData.color}</span>
                </div>
                
                <div className="color-presets">
                  <p>Colores predefinidos:</p>
                  <div className="color-grid">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`color-option ${formData.color === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({...formData, color})}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Agregando...' : 'Agregar Materia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="subjects-grid">
        {subjects.map(subject => (
          <div key={subject.id} className="subject-card">
            <div 
              className="subject-color" 
              style={{ backgroundColor: subject.color }}
            />
            <div className="subject-info">
              <h3>{subject.name}</h3>
              <p>{subject.description || 'Sin descripción'}</p>
              <small>Color: {subject.color}</small>
            </div>
            <div className="subject-actions">
              <button
                onClick={() => handleDelete(subject.id)}
                className="delete-btn"
                title="Eliminar materia"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSubjects;
