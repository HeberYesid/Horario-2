-- Crear base de datos (ejecutar como superusuario)
CREATE DATABASE horario_db;

-- Conectar a la base de datos horario_db antes de ejecutar las siguientes consultas

-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  education_level VARCHAR(50) CHECK (education_level IN ('transicion', 'primaria', 'bachillerato')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de materias
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- Para códigos de color hexadecimal
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de horarios
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
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
CREATE INDEX idx_schedules_subject_id ON schedules(subject_id);
CREATE INDEX idx_schedules_day_time ON schedules(day_of_week, start_time);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subjects_name ON subjects(name);

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

-- Insertar materias predefinidas
INSERT INTO subjects (name, description, color) VALUES 
('Matemáticas', 'Álgebra, geometría, cálculo y estadística', '#FF6B6B'),
('Lengua Castellana', 'Literatura, gramática y redacción', '#4ECDC4'),
('Historia', 'Historia universal y nacional', '#45B7D1'),
('Educación Física', 'Deportes, ejercicio y actividad física', '#96CEB4'),
('Informática', 'Programación, computación y tecnología', '#FFEAA7'),
('Ciencias Naturales', 'Biología, química y física', '#DDA0DD'),
('Inglés', 'Idioma extranjero - Inglés', '#98D8C8'),
('Artes', 'Dibujo, pintura y expresión artística', '#F7DC6F'),
('Música', 'Teoría musical e instrumentos', '#BB8FCE'),
('Geografía', 'Geografía física y humana', '#85C1E9'),
('Filosofía', 'Pensamiento crítico y ética', '#F8C471'),
('Química', 'Elementos, compuestos y reacciones', '#82E0AA'),
('Física', 'Mecánica, termodinámica y óptica', '#F1948A'),
('Religión', 'Educación religiosa y valores', '#D7BDE2'),
('Recreo', 'Tiempo de descanso', '#D5DBDB'),
('Almuerzo', 'Hora de almuerzo', '#F39C12');

-- Datos de ejemplo (opcional)
INSERT INTO users (name, email, password) VALUES 
('Usuario Demo', 'demo@ejemplo.com', '$2b$10$rOqEyQq8sJ6nY9X8sJ6nY9X8sJ6nY9X8sJ6nY9X8sJ6nY9X8sJ6nY');

INSERT INTO schedules (user_id, subject_id, description, day_of_week, start_time, end_time, location) VALUES 
(1, 1, 'Clase de cálculo diferencial', 1, '08:00', '10:00', 'Aula 101'),
(1, 5, 'Desarrollo web con React', 1, '10:30', '12:30', 'Lab Computación'),
(1, 7, 'Conversación avanzada', 2, '14:00', '16:00', 'Aula 205'),
(1, 4, 'Entrenamiento de fuerza', 3, '18:00', '20:00', 'Gimnasio Central');
