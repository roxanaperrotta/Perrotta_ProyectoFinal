import { Router} from "express";
import ProductManager from "../managers/productManager.js";

const router =  Router ();
const productManager = new ProductManager ("./products.json");

router.get ('/products', async (req, res)=>{
    const products = await productManager.getProducts();
    res.render('home', {products});
});

router.get ('/realtimeproducts', async (req, res)=>{
    const products = await productManager.getProducts();
    res.render('realTimeProducts')
});

router.get ('/chat', async (req, res)=>{
    res.render('chat' )
});

export default router;