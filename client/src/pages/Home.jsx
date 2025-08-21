import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>📅 Sistema de Gestión de Horarios</h1>
          <p>Organiza tu tiempo de manera eficiente con nuestro sistema de horarios inteligente</p>
          
          {user ? (
            <div className="hero-actions">
              <Link to="/dashboard" className="btn btn-primary">
                Ir al Dashboard
              </Link>
              <Link to="/schedules" className="btn btn-secondary">
                Ver Mis Horarios
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Comenzar Gratis
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="features">
        <h2>Características Principales</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Gestión Fácil</h3>
            <p>Crea, edita y elimina horarios de manera intuitiva</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Visualización Clara</h3>
            <p>Ve tus horarios semanales de forma organizada</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Seguro y Privado</h3>
            <p>Tus datos están protegidos y son completamente privados</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive</h3>
            <p>Accede desde cualquier dispositivo, en cualquier momento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
