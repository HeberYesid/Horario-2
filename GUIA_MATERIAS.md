# 🎨 Guía de Colores para Materias

## Métodos para Agregar Materias

### 1. **💾 Método SQL (Más Rápido)**
```sql
INSERT INTO subjects (name, description, color) VALUES 
('Nombre de la Materia', 'Descripción', '#CÓDIGO_COLOR');
```

### 2. **🖥️ Método con Interfaz Web**
1. Ejecuta las migraciones SQL primero
2. Ve a: `http://localhost:5174/admin/subjects`
3. Haz clic en "Agregar Materia"
4. Llena el formulario y selecciona un color

### 3. **🔧 Método API**
```bash
POST http://localhost:5000/api/subjects
Authorization: Bearer tu_token
Content-Type: application/json

{
  "name": "Nueva Materia",
  "description": "Descripción",
  "color": "#FF5733"
}
```

## 🎨 Códigos de Colores Recomendados

### **Ciencias**
- 🧪 **Química**: `#82E0AA` (Verde claro)
- 🔬 **Física**: `#F1948A` (Rosa coral)
- 🌱 **Biología**: `#DDA0DD` (Púrpura claro)
- 🌍 **Geografía**: `#85C1E9` (Azul cielo)

### **Matemáticas y Exactas**
- 📊 **Matemáticas**: `#FF6B6B` (Rojo coral)
- 📈 **Estadística**: `#34495E` (Gris azulado)
- 💻 **Informática**: `#FFEAA7` (Amarillo claro)

### **Humanidades**
- 📚 **Lengua**: `#4ECDC4` (Verde azulado)
- 🏛️ **Historia**: `#45B7D1` (Azul)
- 🤔 **Filosofía**: `#F8C471` (Amarillo dorado)
- ⛪ **Religión**: `#D7BDE2` (Púrpura claro)

### **Idiomas**
- 🇺🇸 **Inglés**: `#98D8C8` (Verde menta)
- 🇫🇷 **Francés**: `#E74C3C` (Rojo)
- 🇩🇪 **Alemán**: `#F39C12` (Naranja)

### **Artes y Actividades**
- 🎨 **Artes**: `#F7DC6F` (Amarillo dorado)
- 🎵 **Música**: `#BB8FCE` (Púrpura)
- 🏃 **Educación Física**: `#96CEB4` (Verde menta)

### **Otros**
- ☕ **Recreo**: `#D5DBDB` (Gris claro)
- 🍽️ **Almuerzo**: `#F39C12` (Naranja)
- 🧠 **Psicología**: `#9B59B6` (Púrpura)
- 💰 **Economía**: `#F39C12` (Naranja)

## 📋 Ejemplos de Inserción SQL

```sql
-- Materias adicionales que puedes agregar
INSERT INTO subjects (name, description, color) VALUES 
('Biología', 'Estudio de los seres vivos', '#DDA0DD'),
('Química', 'Elementos y compuestos químicos', '#82E0AA'),
('Psicología', 'Comportamiento humano', '#9B59B6'),
('Francés', 'Idioma extranjero - Francés', '#E74C3C'),
('Tecnología', 'Educación tecnológica', '#3498DB'),
('Ética', 'Valores y principios morales', '#2ECC71'),
('Estadística', 'Análisis de datos', '#34495E'),
('Teatro', 'Artes escénicas', '#E67E22'),
('Emprendimiento', 'Desarrollo empresarial', '#16A085'),
('Medio Ambiente', 'Ecología y sostenibilidad', '#27AE60');
```

## 🎯 Pasos Recomendados

1. **Ejecuta las migraciones SQL** (ver `MIGRACION_INSTRUCCIONES.md`)
2. **Agrega materias básicas** con SQL
3. **Usa la interfaz web** para ajustes y nuevas materias
4. **Las materias aparecerán automáticamente** en el menú desplegable de horarios

¡Listo! Ahora puedes gestionar fácilmente todas las materias de tu sistema. 🎓✨
