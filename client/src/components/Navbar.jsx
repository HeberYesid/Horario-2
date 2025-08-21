import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📅 Sistema de Horarios
        </Link>
        
        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/schedules" className="navbar-link">Mis Horarios</Link>
              <Link to="/admin/subjects" className="navbar-link">Materias</Link>
              <Link to="/profile" className="navbar-link">Perfil</Link>
              <span className="navbar-user">👋 {user.name}</span>
              <button onClick={handleLogout} className="navbar-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Iniciar Sesión</Link>
              <Link to="/register" className="navbar-link navbar-register">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
