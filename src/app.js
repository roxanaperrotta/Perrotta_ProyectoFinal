import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import ProductManager from './managers/productManager.js';
import CartManager from './managers/cartManager.js';
import { upload } from './uploader.js';
import expresshandlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io';

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
app.use ('/realtimeproducts', viewsRouter)
app.use ('/chat', viewsRouter)


//configuración de socket


const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor con express en el puerto ${PORT}`)

const io = new Server(httpServer);

    io.on ('connection', (socket)=>{

    console.log('cliente conectado');
    socket.on ('mensaje', (data)=>{
        console.log(data);
    });
   
    socket.emit ("saludito", "hola cliente, como estas?");

    try {
    const products = productManager.getProducts();
    socket.emit("products", products);
    console.log(products)

    } catch (error) {
    socket.emit('response', { status: 'error', message: error.message });
    }

    });


    io.on("new-Product", (newProduct) => {
    
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

        }
        

        const pushProduct =    productManager.addProduct(productoNuevo);
        const listaActualizada =   productManager.getProducts();
        io.emit("products", listaActualizada);
        io.emit("response", { status: 'success' , message: pushProduct});

    } catch (error) {
        io.emit('response', { status: 'error', message: error.message });
    }
})

// socket para chat

    
    let messages = [];
    
    io.on('connection', (socket) => {
    console.log('Nuevo usuario de chat conectado');

    socket.on('message', (data) => {
       
      
        messages.push(data);
        io.emit ('messagesLogs', messages)  ;

    });

})

})
