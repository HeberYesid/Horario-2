-- SOLUCIÓN RÁPIDA: Script de migración para arreglar el error 500

-- Paso 1: Verificar si la columna subject_id existe
-- Si este comando da error, significa que la columna NO existe
SELECT subject_id FROM schedules LIMIT 1;

-- Paso 2: Si el comando anterior falló, ejecuta esto para agregar la columna:
ALTER TABLE schedules ADD COLUMN subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE;

-- Paso 3: Si la tabla subjects no existe, créala:
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Paso 4: Insertar materias si la tabla está vacía:
INSERT INTO subjects (name, description, color) VALUES 
('Matemáticas', '#FF6B6B'),
('Lengua Castellana', '#4ECDC4'),
('Historia', '#45B7D1'),
('Educación Física', '#96CEB4'),
('Informática', '#FFEAA7'),
('Ciencias Naturales', '#DDA0DD'),
('Inglés', '#98D8C8'),
('Artes', '#F7DC6F'),
('Música', '#BB8FCE'),
('Geografía', '#85C1E9'),
('Filosofía', '#F8C471')
ON CONFLICT (name) DO NOTHING;

-- Paso 5: Migrar datos existentes (si tienes horarios con título)
-- Solo ejecuta esto si tienes horarios existentes con la columna 'title'
UPDATE schedules SET subject_id = 1 WHERE subject_id IS NULL AND LOWER(title) LIKE '%matemática%';
UPDATE schedules SET subject_id = 2 WHERE subject_id IS NULL AND LOWER(title) LIKE '%lengua%';
UPDATE schedules SET subject_id = 3 WHERE subject_id IS NULL AND LOWER(title) LIKE '%historia%';
UPDATE schedules SET subject_id = 4 WHERE subject_id IS NULL AND LOWER(title) LIKE '%física%';
UPDATE schedules SET subject_id = 5 WHERE subject_id IS NULL AND LOWER(title) LIKE '%informática%';

-- Si tienes horarios sin mapear, asigna una materia por defecto:
INSERT INTO subjects (name, description, color) VALUES ('Otras', 'Otras actividades', '#95A5A6') ON CONFLICT (name) DO NOTHING;
UPDATE schedules SET subject_id = (SELECT id FROM subjects WHERE name = 'Otras') WHERE subject_id IS NULL;

-- Verificación final:
SELECT 'OK - Migración completada' as status;
