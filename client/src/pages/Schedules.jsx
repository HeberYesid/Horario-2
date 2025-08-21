import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedules.css';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day_of_week: 1,
    start_time: '',
    end_time: '',
    location: ''
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSchedule) {
        await axios.put(`/api/schedules/${editingSchedule.id}`, formData);
      } else {
        await axios.post('/api/schedules', formData);
      }
      
      loadSchedules();
      resetForm();
    } catch (error) {
      console.error('Error al guardar horario:', error);
      alert('Error al guardar el horario');
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      description: schedule.description || '',
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      location: schedule.location || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      try {
        await axios.delete(`/api/schedules/${id}`);
        loadSchedules();
      } catch (error) {
        console.error('Error al eliminar horario:', error);
        alert('Error al eliminar el horario');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      day_of_week: 1,
      start_time: '',
      end_time: '',
      location: ''
    });
    setEditingSchedule(null);
    setShowForm(false);
  };

  const getDayName = (dayNumber) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayNumber];
  };

  const groupSchedulesByDay = () => {
    const grouped = {};
    for (let i = 0; i <= 6; i++) {
      grouped[i] = schedules.filter(schedule => schedule.day_of_week === i)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
    }
    return grouped;
  };

  if (loading) {
    return <div className="loading">Cargando horarios...</div>;
  }

  const groupedSchedules = groupSchedulesByDay();

  return (
    <div className="schedules">
      <div className="schedules-header">
        <h1>Mis Horarios 📅</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          ➕ Nuevo Horario
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="schedule-form">
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Ej: Matemáticas, Gimnasio, Reunión..."
                />
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción opcional del horario"
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Día de la semana</label>
                  <select
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
                  >
                    <option value={1}>Lunes</option>
                    <option value={2}>Martes</option>
                    <option value={3}>Miércoles</option>
                    <option value={4}>Jueves</option>
                    <option value={5}>Viernes</option>
                    <option value={6}>Sábado</option>
                    <option value={0}>Domingo</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Ej: Aula 101, Gimnasio..."
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Hora de inicio</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Hora de fin</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSchedule ? 'Actualizar' : 'Crear'} Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="schedules-grid">
        {[1, 2, 3, 4, 5, 6, 0].map(day => (
          <div key={day} className="day-column">
            <h3 className="day-header">{getDayName(day)}</h3>
            <div className="day-schedules">
              {groupedSchedules[day].length > 0 ? (
                groupedSchedules[day].map(schedule => (
                  <div key={schedule.id} className="schedule-card">
                    <div className="schedule-header">
                      <h4>{schedule.title}</h4>
                      <div className="schedule-actions">
                        <button 
                          onClick={() => handleEdit(schedule)}
                          className="edit-btn"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(schedule.id)}
                          className="delete-btn"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="schedule-time">
                      {schedule.start_time} - {schedule.end_time}
                    </div>
                    
                    {schedule.description && (
                      <p className="schedule-description">{schedule.description}</p>
                    )}
                    
                    {schedule.location && (
                      <div className="schedule-location">
                        📍 {schedule.location}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-schedules-day">
                  <p>Sin horarios</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedules;
