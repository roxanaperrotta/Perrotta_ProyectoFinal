import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import ProductManager from './dao/db/product.manager.db.js';
import CartManager from './dao/db/cart.manager.db.js';
import multer from 'multer';
import { upload } from './uploader.js';
import expresshandlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io';
import "./database.js";
import imagenRouter from './routes/imagen.routes.js';

//iniciamos el servidor
const app = express ();
const PORT= 8080;

const productManager =  new ProductManager ();
const cartManager = new CartManager ();

//Middlewares

app.use(express.json ());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

//configuramos express-handlebars

app.engine('handlebars', expresshandlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use ('/', viewsRouter);
app.use ('/chat', viewsRouter)
app.use('/', imagenRouter)


//configuración de socket


const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor con express en el puerto ${PORT}`)

const io = new Server(httpServer);

    io.on ('connection', async (socket)=>{

    console.log('cliente conectado');
    socket.on ('mensaje', (data)=>{
        console.log(data);
    });
   
    socket.emit ("saludito", "hola cliente, como estas?");
   // socket.emit ('products', await productManager.getProducts());
   try {
    const products = await productManager.getProducts();
    socket.emit("products", products);
   // console.log(products)

    } catch (error) {
    socket.emit('response', { status: 'error', message: error.message });
    }

    

    socket.on("new-Product", async (newProduct) => {
    
        try {

                // validar price
                if (typeof newProduct.price !== 'number') {
                console.error('Price must be a number');
                // error
        }

               // validar stock
                if (typeof newProduct.stock !== 'number') {
                console.error('Stock must be a number');
                }
            

        const productoNuevo = {
              
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                stock: newProduct.stock,
                thumbnail: newProduct.thumbnail,
                category:newProduct.category,
                staus:newProduct.status

        }

        const pushProduct =  await productManager.addProduct(productoNuevo);
        const listaActualizada =   await productManager.getProducts();
        socket.emit("products", listaActualizada);
        socket.emit("response", { status: 'success' , message: pushProduct});

    } catch (error) {
        socket.emit('response', { status: 'error', message: error.message });
    }

    socket.on("delete-product",  async (id) => {
        try {
            const pid = (id);
            const deleteProduct =  await productManager.deleteProduct(pid)
            const listaActualizada = await productManager.getProducts()
            socket.emit("products", listaActualizada)
            socket.emit('response', { status: 'success' , message: "producto eliminado correctamente"});
        } catch (error) {
            socket.emit('response', { status: 'error', message: error.message });
        }
    } )
})

// socket para chat

    
    let messages = [];
    
    io.on('connection', (socket) => {
    console.log('Nuevo usuario de chat conectado');

    socket.on('message', (data) => {
       
      
     messages.push(data);
     socket.emit ('messageLogs', messages)  ;

    });

})


    })
})
