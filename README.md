🛒 Proyecto Ecommerce - Backend II (Entrega Nº1)
📚 Descripción

Este proyecto forma parte del curso Backend II de CoderHouse.
La entrega Nº1 implementa un CRUD de usuarios, junto con un sistema de autenticación y autorización utilizando Passport y JWT (JSON Web Tokens), sobre la base del ecommerce facilitado al inicio del curso.

El objetivo es crear un backend robusto, seguro y escalable para gestionar usuarios, productos y carritos de compra.

⚙️ Tecnologías utilizadas

Node.js + Express

MongoDB + Mongoose

Handlebars (motor de plantillas)

Passport + Passport-JWT + Passport-Local

Bcrypt (encriptación de contraseñas)

JWT (jsonwebtoken) (autenticación basada en tokens)

Socket.io (actualización en tiempo real)

Nodemon (entorno de desarrollo)



🚀 Instalación y ejecución
1️⃣ Clonar el repositorio
git clone https://github.com/MafeTech24/backendII-Preentrega1MariaFernandaMoreno.git
cd ecommerce-backend

2️⃣ Instalar dependencias
npm install

3️⃣ Configurar variables de entorno

Crear un archivo .env o definir las variables en config.js:

MONGO_URL=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/
DB_NAME=ecommerce
PORT=8080
JWT_SECRET=secretCoder123

4️⃣ Ejecutar el servidor
npm run dev


El servidor estará disponible en:
👉 http://localhost:8080

🧪 Endpoints principales (API REST)
👤 Usuarios
Crear usuario

POST /api/users

{
  "first_name": "Juan",
  "last_name": "Perez",
  "email": "juan@example.com",
  "age": 32,
  "password": "12345"
}

Obtener todos los usuarios

GET /api/users

🔐 Sesiones
Login de usuario

POST /api/sessions/login

{
  "email": "juan@example.com",
  "password": "12345"
}


📤 Respuesta:

{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}

Usuario autenticado (ruta protegida)

GET /api/sessions/current

🧩 Header:

Authorization: Bearer <token>


📤 Respuesta:

{
  "user": {
    "first_name": "Juan",
    "last_name": "Perez",
    "email": "juan@example.com",
    "role": "user"
  }
}

🔐 Seguridad implementada

Contraseñas encriptadas con bcrypt.hashSync().

Tokens JWT con expiración y validación mediante Passport-JWT.

Rutas protegidas que verifican autenticación antes de permitir acceso.

Manejo de errores y respuestas JSON consistentes.

👩‍💻 Autor

María Fernanda Moreno
📍 CoderHouse - Curso Backend II
📅 Octubre 2025
