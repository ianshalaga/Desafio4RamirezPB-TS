import express from "express";
import { Express } from "express";
import productsRouter from "./routes/products.route";
import cartsRouter from "./routes/carts.route";
import { PORT } from "./utils/ports";
import { rootPath, productsPath } from "./utils/paths";
import { apiRoute, productsRoute, cartsRoute } from "./utils/routes";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.route";
import { Server } from "socket.io";
import ProductManager from "./classes/ProductManager";
import IdProduct from "./interfaces/IdProduct";
import Product from "./classes/Product";

const app: Express = express(); // Express.js application instance creation

// Express.js server start
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor de Express.js corriendo en el puerto: ${PORT}`)
);
const io = new Server(httpServer); // Socket.IO server start in same port that httpServer

/** MIDDLEWARES */
app.use(express.urlencoded({ extended: true })); // Complex URLs format mapping
app.use(express.static(`${rootPath}/public`)); // Serves static files from public folder
app.use(express.json()); // Format JSON requests to JavaScript Object format (POST / PUT)
app.set("views", rootPath + "/src/views"); // Sets the path where Express will look for the views of the application
app.engine("handlebars", handlebars.engine()); // Sets up Handlebars as the template engine for Express.js. Allows to use Handlebars template files (*.handlebars).
app.set("view engine", "handlebars"); // Sets Handlebars to view engine for Express application

/** ROUTES */
app.use(apiRoute + productsRoute, productsRouter);
app.use(apiRoute + cartsRoute, cartsRouter);
app.use(viewsRouter); // Views

// WEBSOCKETS
io.on("connection", async (socket) => {
  console.log("Cliente conectado");
  const productManager: ProductManager = new ProductManager(productsPath);
  let products: IdProduct[] = await productManager.getProducts();

  socket.emit("products", products);

  socket.on("newProduct", async (newProduct: Product) => {
    console.log("Nuevo producto");
    console.log(newProduct);
    await productManager.addProduct(newProduct, () => {});
    products = await productManager.getProducts();
    socket.emit("products", products);
  });
});
