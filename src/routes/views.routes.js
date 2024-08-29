import { Router} from "express";
import ProductManager from "../dao/db/product.manager.db.js";

const router =  Router ();
const productManager = new ProductManager ();

router.get ('/products', async (req, res)=>{
    const products = await productManager.getProducts();

    const nuevoArray = products.map (product =>{
        return{
            _id:product._id,
            title: product.title,
            description: product.description,
            code: product.code,
            price:product.price,
            stock:product.stock,
            thumbnail:product.thumbnail
        }
    })

    res.render('home', {products:nuevoArray});
});

router.get ('/realtimeproducts', async (req, res)=>{
   // const products = await productManager.getProducts();
    res.render('realTimeProducts')
});

router.get ('/chat', async (req, res)=>{
    res.render('chat' )
});

export default router;