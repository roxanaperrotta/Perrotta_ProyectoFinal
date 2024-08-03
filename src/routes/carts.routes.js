import express from "express";
import CartManager from "../managers/cartManager.js";


const cartManager = new CartManager("../carts.json");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Error del servidor, acción denegada");
    }
});


router.get("/:cid", async (req, res) => {
    let cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        res.status(500).send("error, no se pudo obtener el producto del carrito");
    }
});


router.post("/cart", async (req, res)=>{
    try {
        const cart=req.body
        const newCart = await cartManager.addCart(cart)
        res.json(newCart);

    } catch (error) {
        console.error("error")

    }
 });



 router.post("/:cid/product/:pid", async (req, res) => {
    let cartId = parseInt(req.params.cid);
    let productId = req.params.pid;
    let quantity = req.body.quantity || 1;

    try {
        const cartUpdated = await cartManager.addProductsCart(cartId, productId, quantity);
        res.json(cartUpdated.products);
    } catch (error) {
        res.status(500).send("error al agregar producto al carrito");
    }
});


router.delete("/cart/:cid/product/:pid", async(req, res)=>{
    try {
        const cartId = parseInt(req.params.cid);
        const productId=parseInt(req.params.pid);
        const cart= await cartManager.deleteProduct(cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({error:error.message})

    };
});



export default router 