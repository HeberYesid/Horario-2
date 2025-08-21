# 🔧 Guía de Solución de Problemas - Error al Crear Horario

## 🚨 Problema Reportado
Error al presionar "Crear Horario" - Aparece ventana emergente con "Error al guardar horario"

## 🔍 Pasos de Diagnóstico

### 1. **Verificar que las migraciones se ejecutaron**
```sql
-- Conecta a tu base de datos y ejecuta:
\d subjects
\d schedules

-- Debe mostrar la tabla subjects y la columna subject_id en schedules
```

### 2. **Abrir la Consola del Navegador**
1. Ve a `http://localhost:5174/schedules`
2. Presiona **F12** para abrir las herramientas de desarrollador
3. Ve a la pestaña **Console**
4. Intenta crear un horario
5. Observa los mensajes de error

### 3. **Verificar el Token de Autenticación**
En la consola del navegador, verifica:
```javascript
// Debe mostrar un token
console.log(localStorage.getItem('token'));
```

### 4. **Probar la API Directamente**
Abre una nueva pestaña y ve a:
- `http://localhost:5000/api/subjects` - Debe mostrar las materias
- `http://localhost:5000/api/test-db` - Debe mostrar conexión exitosa

## 🛠️ Soluciones Comunes

### **Problema 1: Migraciones no ejecutadas**
**Síntomas:** Error "tabla subjects no existe"
**Solución:**
```sql
-- Ejecuta en tu base de datos PostgreSQL:
-- 1. Crear tabla subjects
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insertar materias básicas
INSERT INTO subjects (name, description, color) VALUES 
('Matemáticas', 'Álgebra, geometría, cálculo', '#FF6B6B'),
('Lengua Castellana', 'Literatura y gramática', '#4ECDC4'),
('Historia', 'Historia universal', '#45B7D1'),
('Educación Física', 'Deportes y ejercicio', '#96CEB4'),
('Informática', 'Programación y tecnología', '#FFEAA7');

-- 3. Agregar columna subject_id a schedules
ALTER TABLE schedules ADD COLUMN subject_id INTEGER REFERENCES subjects(id);
```

### **Problema 2: Token de autenticación expirado**
**Síntomas:** Error 401 o "No autorizado"
**Solución:**
1. Cierra sesión y vuelve a iniciar sesión
2. O limpia el localStorage: `localStorage.clear()`

### **Problema 3: Backend no está ejecutándose**
**Síntomas:** "No se pudo conectar con el servidor"
**Solución:**
```bash
cd server
npm start
```

### **Problema 4: Puerto ocupado**
**Síntomas:** Backend no inicia
**Solución:**
```bash
# Buscar proceso que usa el puerto 5000
netstat -ano | findstr :5000
# Matar el proceso si es necesario
taskkill /PID [número_del_proceso] /F
```

## 📋 Checklist de Verificación

- [ ] ✅ Backend ejecutándose en puerto 5000
- [ ] ✅ Frontend ejecutándose en puerto 5174
- [ ] ✅ Base de datos PostgreSQL conectada
- [ ] ✅ Tabla `subjects` existe con datos
- [ ] ✅ Columna `subject_id` existe en tabla `schedules`
- [ ] ✅ Usuario logueado con token válido
- [ ] ✅ Materias aparecen en el select del formulario

## 🆘 Si Nada Funciona

1. **Reinicia todo:**
   ```bash
   # Terminal 1: Backend
   cd server
   npm start
   
   # Terminal 2: Frontend  
   cd client
   npm run dev
   ```

2. **Limpia el navegador:**
   - Presiona F12 → Application → Storage → Clear storage

3. **Verifica logs:**
   - Consola del navegador (F12)
   - Terminal donde corre el backend
   - Logs de PostgreSQL

## 📞 Información de Debug

Cuando reportes el error, incluye:
- Mensaje exacto de la consola del navegador
- Respuesta de `http://localhost:5000/api/subjects`
- Logs del terminal del backend
- Estado de la base de datos (`\d subjects`, `\d schedules`)

¡Con esta información podremos identificar y solucionar el problema rápidamente! 🚀
