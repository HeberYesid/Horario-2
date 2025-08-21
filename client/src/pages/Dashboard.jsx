import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSchedules: 0,
    todaySchedules: 0,
    weekSchedules: 0
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (scheduleData) => {
    const today = new Date().getDay();
    const todaySchedules = scheduleData.filter(schedule => schedule.day_of_week === today);
    
    setStats({
      totalSchedules: scheduleData.length,
      todaySchedules: todaySchedules.length,
      weekSchedules: scheduleData.length
    });
  };

  const getDayName = (dayNumber) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayNumber];
  };

  const getTodaySchedules = () => {
    const today = new Date().getDay();
    return schedules
      .filter(schedule => schedule.day_of_week === today)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>¡Bienvenido, {user?.name}! 👋</h1>
        <p>Aquí tienes un resumen de tus horarios</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalSchedules}</h3>
            <p>Total de Horarios</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.todaySchedules}</h3>
            <p>Horarios de Hoy</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.weekSchedules}</h3>
            <p>Esta Semana</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="today-schedules">
          <h2>Horarios de Hoy ({getDayName(new Date().getDay())})</h2>
          {getTodaySchedules().length > 0 ? (
            <div className="schedule-list">
              {getTodaySchedules().map(schedule => (
                <div key={schedule.id} className="schedule-item">
                  <div className="schedule-time">
                    {schedule.start_time} - {schedule.end_time}
                  </div>
                  <div className="schedule-details">
                    <h4>{schedule.title}</h4>
                    {schedule.description && <p>{schedule.description}</p>}
                    {schedule.location && (
                      <span className="schedule-location">📍 {schedule.location}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-schedules">
              <p>🎉 No tienes horarios para hoy. ¡Disfruta tu día libre!</p>
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="action-buttons">
            <a href="/schedules" className="action-btn">
              <span className="action-icon">➕</span>
              Crear Nuevo Horario
            </a>
            <a href="/schedules" className="action-btn">
              <span className="action-icon">📋</span>
              Ver Todos los Horarios
            </a>
            <a href="/profile" className="action-btn">
              <span className="action-icon">👤</span>
              Editar Perfil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
