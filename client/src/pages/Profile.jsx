import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await updateProfile(formData);
    
    if (result.success) {
      setMessage('Perfil actualizado exitosamente');
      setIsEditing(false);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    
    setLoading(false);
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="profile-info">
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal</p>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h2>Información Personal</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : '💾 Guardar Cambios'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-display">
                <div className="info-item">
                  <label>Nombre completo</label>
                  <p>{user?.name}</p>
                </div>

                <div className="info-item">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>

                <div className="info-item">
                  <label>Miembro desde</label>
                  <p>
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'No disponible'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <h2>Estadísticas</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h3>Activo</h3>
                  <p>Usuario verificado</p>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">🔒</div>
                <div className="stat-content">
                  <h3>Seguro</h3>
                  <p>Datos protegidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
