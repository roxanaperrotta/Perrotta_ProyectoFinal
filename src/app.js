import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import ProductManager from './managers/productManager.js';
import CartManager from './managers/cartManager.js';
import { upload } from './uploader.js';



const app = express ();
const PORT= 8080;

const productManager =  new ProductManager ();
const cartManager = new CartManager ();



app.use(express.json ());

app.use( '/static' , express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);



app.listen(PORT, ()=>{
    console.log(`Servidor con express en el puerto ${PORT}`)

});