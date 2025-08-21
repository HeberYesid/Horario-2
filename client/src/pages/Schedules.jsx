import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedules.css';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    subject_id: '',
    description: '',
    day_of_week: 1,
    start_time: '',
    end_time: '',
    location: ''
  });

  useEffect(() => {
    loadSchedules();
    loadSubjects();
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
    
    // Validación adicional
    if (!formData.subject_id) {
      alert('Por favor selecciona una materia');
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      alert('Por favor completa las horas de inicio y fin');
      return;
    }

    try {
      // Convertir subject_id a número entero
      const scheduleData = {
        subject_id: parseInt(formData.subject_id),
        description: formData.description || '',
        day_of_week: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location || ''
      };

      console.log('Enviando datos del horario:', scheduleData); // Debug
      
      let response;
      if (editingSchedule) {
        response = await axios.put(`/api/schedules/${editingSchedule.id}`, scheduleData);
      } else {
        response = await axios.post('/api/schedules', scheduleData);
      }
      
      console.log('Respuesta del servidor:', response.data); // Debug
      
      loadSchedules();
      resetForm();
      alert('Horario guardado exitosamente!');
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response);
      
      let errorMessage = 'Error desconocido';
      
      if (error.response) {
        // El servidor respondió con un status de error
        errorMessage = error.response.data?.error || `Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor';
      } else {
        // Algo pasó al configurar la petición
        errorMessage = error.message;
      }
      
      alert(`Error al guardar el horario: ${errorMessage}`);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      subject_id: schedule.subject_id,
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
      subject_id: '',
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
          ➕ Nuevo
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
                <label>Materia</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                  required
                >
                  <option value="">Selecciona una materia</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
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
                  <div 
                    key={schedule.id} 
                    className="schedule-card"
                    style={{ borderLeft: `4px solid ${schedule.subject_color || '#95A5A6'}` }}
                  >
                    <div className="schedule-header">
                      <h4>{schedule.subject_name}</h4>
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
