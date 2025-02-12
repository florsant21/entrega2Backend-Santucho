import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 8080;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = [];

app.get("/", (req, res) => {
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { products });
});

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado:", socket.id);

  socket.emit("updateProducts", products);

  socket.on("newProduct", (product) => {
    products.push(product);
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", (index) => {
    if (index >= 0 && index < products.length) {
      products.splice(index, 1);
      io.emit("updateProducts", products);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});