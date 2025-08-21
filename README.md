# Sistema de Gestión de Horarios - PERN Stack

Un sistema completo de gestión de horarios construido con PostgreSQL, Express.js, React y Node.js.

## 🚀 Características

- **Autenticación de usuarios** - Registro e inicio de sesión seguro con JWT
- **Gestión de horarios** - Crear, editar, eliminar y visualizar horarios
- **Panel de control** - Vista general de horarios y estadísticas
- **Perfil de usuario** - Gestión de información personal
- **Diseño responsivo** - Interfaz moderna que funciona en todos los dispositivos

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas

### Frontend
- **React** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **React Router** - Enrutamiento del lado del cliente
- **Axios** - Cliente HTTP para peticiones API
- **CSS Modules** - Estilos modulares

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd "Horario 2"
```

### 2. Configurar la base de datos
1. Crear una base de datos PostgreSQL llamada `schedule_management`
2. Ejecutar el script de esquema:
```bash
psql -U tu_usuario -d schedule_management -f server/database/schema.sql
```

### 3. Configurar el backend
```bash
cd server
npm install
```

Crear archivo `.env` en la carpeta `server`:
```env
PORT=5000
JWT_SECRET=tu_jwt_secret_muy_seguro
PGUSER=tu_usuario_postgresql
PGHOST=localhost
PGDATABASE=schedule_management
PGPASSWORD=tu_contraseña
PGPORT=5432
```

### 4. Configurar el frontend
```bash
cd ../client
npm install
```

### 5. Ejecutar la aplicación

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Estructura del Proyecto

```
Horario 2/
├── server/                 # Backend Node.js/Express
│   ├── routes/            # Rutas de la API
│   │   ├── auth.js        # Autenticación
│   │   ├── users.js       # Gestión de usuarios
│   │   └── schedules.js   # Gestión de horarios
│   ├── middleware/        # Middleware personalizado
│   │   └── auth.js        # Middleware de autenticación
│   ├── database/          # Scripts de base de datos
│   │   └── schema.sql     # Esquema de la base de datos
│   ├── package.json       # Dependencias del backend
│   └── index.js           # Punto de entrada del servidor
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   └── Navbar.jsx
│   │   ├── pages/         # Páginas de la aplicación
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Schedules.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/       # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Punto de entrada
│   ├── package.json       # Dependencias del frontend
│   └── vite.config.js     # Configuración de Vite
└── README.md              # Este archivo
```

## 🔗 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users/profile` - Obtener perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil del usuario

### Horarios
- `GET /api/schedules` - Obtener todos los horarios del usuario
- `POST /api/schedules` - Crear nuevo horario
- `PUT /api/schedules/:id` - Actualizar horario
- `DELETE /api/schedules/:id` - Eliminar horario

## 🎨 Características de la Interfaz

- **Página de inicio** - Presentación de características y navegación
- **Autenticación** - Formularios de registro e inicio de sesión
- **Panel de control** - Vista general con estadísticas y horarios del día
- **Gestión de horarios** - Interfaz completa CRUD con vista semanal
- **Perfil de usuario** - Gestión de información personal con estadísticas

## 🔒 Seguridad

- Autenticación JWT
- Contraseñas encriptadas con bcrypt
- Middleware de autenticación en rutas protegidas
- Validación de entrada en formularios
- CORS configurado apropiadamente

## 🚀 Scripts Disponibles

### Backend (server/)
- `npm start` - Ejecutar servidor en producción
- `npm run dev` - Ejecutar servidor en desarrollo con nodemon

### Frontend (client/)
- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Reporte de Errores

Si encuentras algún error, por favor crea un issue describiendo:
- El comportamiento esperado
- El comportamiento actual
- Pasos para reproducir el error
- Información del sistema (OS, Node.js version, etc.)

## 📞 Contacto

Para preguntas o sugerencias, por favor contacta al equipo de desarrollo.

---

Desarrollado con ❤️ usando el stack PERN
