# Instrucciones para ejecutar las migraciones de la base de datos

## Migración 1: Campo education_level para usuarios

### Pasos para agregar el campo education_level:

1. **Conectar a PostgreSQL:**
   - Abre pgAdmin o conecta via psql a tu base de datos horario_db
   - O usa el siguiente comando si tienes psql en tu PATH:
     ```
     psql -U tu_usuario -d horario_db
     ```

2. **Ejecutar la migración:**
   ```sql
   ALTER TABLE users 
   ADD COLUMN education_level VARCHAR(50) 
   CHECK (education_level IN ('transicion', 'primaria', 'bachillerato'));
   ```

## Migración 2: Sistema de materias predefinidas

### Pasos para agregar el sistema de materias:

1. **Ejecutar el archivo de migración completo:**
   - Navega a `server/database/migrations/add_subjects_table.sql`
   - Ejecuta todo el contenido del archivo en tu base de datos

2. **O ejecutar paso a paso:**

   **Crear tabla de materias:**
   ```sql
   CREATE TABLE subjects (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL UNIQUE,
     description TEXT,
     color VARCHAR(7),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

   **Insertar materias predefinidas:**
   ```sql
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
   ```

   **Agregar columna subject_id a schedules:**
   ```sql
   ALTER TABLE schedules ADD COLUMN subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE;
   ```

   **Migrar datos existentes (opcional):**
   ```sql
   -- Mapear títulos existentes a materias
   UPDATE schedules SET subject_id = 1 WHERE LOWER(title) LIKE '%matemática%';
   UPDATE schedules SET subject_id = 2 WHERE LOWER(title) LIKE '%lengua%';
   UPDATE schedules SET subject_id = 3 WHERE LOWER(title) LIKE '%historia%';
   UPDATE schedules SET subject_id = 4 WHERE LOWER(title) LIKE '%educación física%' OR LOWER(title) LIKE '%gimnasio%';
   UPDATE schedules SET subject_id = 5 WHERE LOWER(title) LIKE '%informática%' OR LOWER(title) LIKE '%programación%';
   -- ... (ver archivo completo para más mapeos)
   
   -- Crear materia "Otras" para registros no mapeados
   INSERT INTO subjects (name, description, color) VALUES ('Otras', 'Otras actividades', '#95A5A6');
   UPDATE schedules SET subject_id = (SELECT id FROM subjects WHERE name = 'Otras') WHERE subject_id IS NULL;
   ```

   **Crear índices:**
   ```sql
   CREATE INDEX idx_schedules_subject_id ON schedules(subject_id);
   CREATE INDEX idx_subjects_name ON subjects(name);
   ```

3. **Verificar que las migraciones se ejecutaron correctamente:**
   ```sql
   \d users
   \d subjects
   \d schedules
   SELECT * FROM subjects;
   ```

## Cambios realizados en la aplicación:

### Backend:
- ✅ Actualizado `schema.sql` para incluir tabla `subjects`
- ✅ Modificado `routes/schedules.js` para usar `subject_id` en lugar de `title`
- ✅ Creado `routes/subjects.js` para manejar las materias
- ✅ Actualizado `index.js` para incluir las rutas de materias

### Frontend:
- ✅ Modificado `Schedules.jsx` para usar select de materias predefinidas
- ✅ Actualizado la visualización de horarios con colores por materia
- ✅ Agregados estilos CSS para mejor presentación

### Funcionalidades del sistema de materias:
- **Materias predefinidas**: 16 materias con colores únicos
- **Validación**: Solo permite materias existentes en la base de datos
- **Colores**: Cada materia tiene un color distintivo para mejor visualización
- **API**: Endpoints para obtener, crear, actualizar y eliminar materias
- **Migración**: Script automático para migrar datos existentes

¡El sistema de materias está completamente funcional y listo para usar! 📚🎨
