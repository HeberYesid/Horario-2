-- Migración para agregar tabla de materias y actualizar schedules
-- Ejecutar este script para bases de datos existentes

-- 1. Crear tabla de materias
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- Para códigos de color hexadecimal
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insertar materias predefinidas
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

-- 3. Agregar columna subject_id a schedules
ALTER TABLE schedules ADD COLUMN subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE;

-- 4. Migrar datos existentes (opcional - mapear títulos a materias)
-- Puedes personalizar estas actualizaciones según tus datos existentes
UPDATE schedules SET subject_id = 1 WHERE LOWER(title) LIKE '%matemática%' OR LOWER(title) LIKE '%math%';
UPDATE schedules SET subject_id = 2 WHERE LOWER(title) LIKE '%lengua%' OR LOWER(title) LIKE '%español%' OR LOWER(title) LIKE '%literatura%';
UPDATE schedules SET subject_id = 3 WHERE LOWER(title) LIKE '%historia%';
UPDATE schedules SET subject_id = 4 WHERE LOWER(title) LIKE '%educación física%' OR LOWER(title) LIKE '%gimnasio%' OR LOWER(title) LIKE '%deporte%';
UPDATE schedules SET subject_id = 5 WHERE LOWER(title) LIKE '%informática%' OR LOWER(title) LIKE '%programación%' OR LOWER(title) LIKE '%computación%';
UPDATE schedules SET subject_id = 6 WHERE LOWER(title) LIKE '%ciencias%' OR LOWER(title) LIKE '%biología%';
UPDATE schedules SET subject_id = 7 WHERE LOWER(title) LIKE '%inglés%' OR LOWER(title) LIKE '%english%';
UPDATE schedules SET subject_id = 8 WHERE LOWER(title) LIKE '%arte%' OR LOWER(title) LIKE '%dibujo%';
UPDATE schedules SET subject_id = 9 WHERE LOWER(title) LIKE '%música%';
UPDATE schedules SET subject_id = 10 WHERE LOWER(title) LIKE '%geografía%';
UPDATE schedules SET subject_id = 11 WHERE LOWER(title) LIKE '%filosofía%';
UPDATE schedules SET subject_id = 12 WHERE LOWER(title) LIKE '%química%';
UPDATE schedules SET subject_id = 13 WHERE LOWER(title) LIKE '%física%';
UPDATE schedules SET subject_id = 14 WHERE LOWER(title) LIKE '%religión%';
UPDATE schedules SET subject_id = 15 WHERE LOWER(title) LIKE '%recreo%' OR LOWER(title) LIKE '%descanso%';
UPDATE schedules SET subject_id = 16 WHERE LOWER(title) LIKE '%almuerzo%' OR LOWER(title) LIKE '%comida%';

-- 5. Para registros que no coincidieron, asignar a "Otras" (crear si es necesario)
INSERT INTO subjects (name, description, color) VALUES ('Otras', 'Otras actividades', '#95A5A6')
ON CONFLICT (name) DO NOTHING;

UPDATE schedules SET subject_id = (SELECT id FROM subjects WHERE name = 'Otras') 
WHERE subject_id IS NULL;

-- 6. Crear índices
CREATE INDEX idx_schedules_subject_id ON schedules(subject_id);
CREATE INDEX idx_subjects_name ON subjects(name);

-- 7. Opcional: Eliminar la columna title después de verificar que la migración es correcta
-- ALTER TABLE schedules DROP COLUMN title;

-- Nota: Mantener la columna 'title' temporalmente hasta verificar que todo funcione correctamente
