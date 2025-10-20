const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const ProductsManager = require("./dao/ProductManager");
const { productosModelo } = require("./dao/models/productsModels");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const { conectarDB } = require("./config/db");
const { config } = require("./config/config");

//                                                                                                                               importaciones para usuarios y autenticación
const passport = require("./config/passport");
const usersRouter = require("./routes/users.router");
const sessionsRouter = require("./routes/sessions.router");

const productManager = new ProductsManager();
const app = express();

const PORT = config.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer);

const CartManager = require("./dao/CartManager");

// Middleware base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// Inicialización de Passport
app.use(passport.initialize());

// Rutas de la API
app.use("/api/users", usersRouter);       
app.use("/api/sessions", sessionsRouter); 
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

// Configuración Handlebars
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    eq: (a, b) => a === b,
    multiply: (a, b) => a * b,
    calculateTotal: (products) => {
      return products.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// WebSockets
io.on("connection", async (socket) => {
  console.log("Cliente Conectado");

  const products = await productManager.getPaginated({}, { limit: 10, page: 1 });
  socket.emit("products", products.docs);

  socket.on("addProduct", async (product) => {
    try {
      await ProductsManager.createProduct(product);
      const updated = await productManager.getPaginated({}, { limit: 10, page: 1 });
      io.emit("products", updated.docs);
    } catch (err) {
      console.error("Error al agregar producto:", err.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    const updated = await productManager.getAll();
    io.emit("products", updated.docs);
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("Error general:", err);
  res.status(500).json({ error: "Error interno del servidor", details: err.message });
});

app.use((req, res) => {
  res.status(404).json({ message: "Página no encontrada", code: 404 });
});

// Conexión a MongoDB
conectarDB(config.MONGO_URL, config.DB_NAME)
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err.message);
    process.exit(1);
  });
