-- Script de diagnóstico y reparación rápida
-- Ejecuta este script en tu base de datos PostgreSQL

-- 1. Verificar estructura actual de la tabla schedules
\d schedules

-- 2. Verificar si existe la tabla subjects
\d subjects

-- 3. Si la columna subject_id NO existe en schedules, ejecuta esto:
ALTER TABLE schedules ADD COLUMN subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE;

-- 4. Si la tabla subjects NO existe, ejecuta esto:
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insertar materias básicas si la tabla estaba vacía:
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
('Almuerzo', 'Hora de almuerzo', '#F39C12')
ON CONFLICT (name) DO NOTHING;

-- 6. Crear índices si no existen:
CREATE INDEX IF NOT EXISTS idx_schedules_subject_id ON schedules(subject_id);
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects(name);

-- 7. Verificar que todo esté bien:
SELECT 'subjects table' as table_name, COUNT(*) as records FROM subjects
UNION ALL
SELECT 'schedules table' as table_name, COUNT(*) as records FROM schedules;

-- 8. Verificar que subject_id existe:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'schedules' AND column_name = 'subject_id';
