import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 8080;

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware para archivos estáticos
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Almacén de productos (simulación de base de datos en memoria)
const products = [];

// Rutas
app.get("/", (req, res) => {
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { products });
});

// Configuración de WebSockets
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado:", socket.id);

  // Enviar la lista inicial de productos al cliente
  socket.emit("updateProducts", products);

  // Escuchar cuando se añade un nuevo producto
  socket.on("newProduct", (product) => {
    products.push(product);
    io.emit("updateProducts", products);
  });

  // Escuchar cuando se elimina un producto por su índice
  socket.on("deleteProduct", (index) => {
    if (index >= 0 && index < products.length) {
      products.splice(index, 1);
      io.emit("updateProducts", products);
    }
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});