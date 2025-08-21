-- Crear base de datos (ejecutar como superusuario)
CREATE DATABASE horario_db;

-- Conectar a la base de datos horario_db antes de ejecutar las siguientes consultas

-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de horarios
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Domingo, 6 = Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_schedules_day_time ON schedules(day_of_week, start_time);
CREATE INDEX idx_users_email ON users(email);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at 
  BEFORE UPDATE ON schedules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo (opcional)
INSERT INTO users (name, email, password) VALUES 
('Usuario Demo', 'demo@ejemplo.com', '$2b$10$rOqEyQq8sJ6nY9X8sJ6nY9X8sJ6nY9X8sJ6nY9X8sJ6nY9X8sJ6nY');

INSERT INTO schedules (user_id, title, description, day_of_week, start_time, end_time, location) VALUES 
(1, 'Matemáticas', 'Clase de cálculo diferencial', 1, '08:00', '10:00', 'Aula 101'),
(1, 'Programación', 'Desarrollo web con React', 1, '10:30', '12:30', 'Lab Computación'),
(1, 'Inglés', 'Conversación avanzada', 2, '14:00', '16:00', 'Aula 205'),
(1, 'Gimnasio', 'Entrenamiento de fuerza', 3, '18:00', '20:00', 'Gimnasio Central');
