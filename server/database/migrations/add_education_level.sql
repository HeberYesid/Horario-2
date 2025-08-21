-- Migración para agregar el campo education_level a la tabla users
-- Ejecutar este script si ya tienes una base de datos existente

ALTER TABLE users 
ADD COLUMN education_level VARCHAR(50) 
CHECK (education_level IN ('transicion', 'primaria', 'bachillerato'));

-- Comentario: El campo es opcional, por lo que se puede dejar NULL
-- Si deseas hacer el campo obligatorio, descomenta la siguiente línea después de actualizar los registros existentes
-- ALTER TABLE users ALTER COLUMN education_level SET NOT NULL;
