# API de Productos y Carritos

Proyecto realizado con **Node.js**, **Express**, **Handlebars** y **Socket.IO**.

Incluye persistencia en archivos `.json`, renderizado de vistas con Handlebars y actualización en tiempo real con WebSockets.

---

## 🔧 Tecnologías utilizadas

- Node.js
- Express
- Express Router
- Handlebars (motor de plantillas)
- Socket.IO (websockets)
- FileSystem (para `products.json` y `carts.json`)

---

## 📦 Endpoints de la API

### Productos `/api/products`
- `GET /` – Lista todos los productos
- `GET /:pid` – Muestra un producto por ID
- `POST /` – Agrega un producto (JSON)
- `PUT /:pid` – Actualiza un producto
- `DELETE /:pid` – Elimina un producto

### Carritos `/api/carts`
- `POST /` – Crea un nuevo carrito
- `GET /:cid` – Muestra los productos del carrito
- `POST /:cid/product/:pid` – Agrega un producto a un carrito

---

## 👀 Vistas dinámicas

### `/` — **Vista Home**
- Renderiza la lista completa de productos desde `products.json`
- Se actualiza al recargar la página tras modificar productos desde la API

### `/realtimeproducts` — **Vista en tiempo real**
- Muestra todos los productos en vivo usando Socket.IO
- Incluye:
  - **Formulario para agregar productos**
  - **Botones para eliminar productos**
- Los cambios se propagan automáticamente a todos los clientes conectados
- Se usa `ProductManager.js` para persistencia

---

## 🔌 WebSockets con Socket.IO

- El servidor emite y escucha eventos mediante `socket.io`
- Las acciones de **crear** o **eliminar** productos:
  - Actualizan `products.json`
  - Emiten la lista actualizada a todos los navegadores conectados
- El archivo `public/js/realtime.js` maneja la lógica cliente

---

## Uso
El servidor escucha en el puerto `8080`.


