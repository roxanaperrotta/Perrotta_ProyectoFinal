
import express from "express";
import ProductManager from "../managers/productManager.js";

const router = express.Router();

const productManager = new ProductManager('./products.json');

router.get("/", async (req, res)=>{
    
    try {
          const data=  await productManager.getProducts() 

          const limite = parseInt(req.query.limit);

          const products = limite ? data.slice(0,limite) : data

          res.status(200).json({message:"success", products});    

    }catch (error) {
    
          res.status(500).json({ message: 'Internal Server Error', error: error.message });
    };

});

router.get('/:pid',  async (req, res)=>{

    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId)
    res.json(product);
    
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
    });

router.post('/', async (req, res) => {

        try {
            const {title, description, price, code} = req.body;
            const productoNuevo = await productManager.addProduct(title, description, price, code);

            if (!productoNuevo) {
                res.status(500).json({ error: "Error al crear el producto" });
                return;
            }

            res.status(200).json(productoNuevo);

        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

router.put("/:pid", async(req, res)=>{
    try{
        const id= parseInt(req.params.pid);
        const updatedFields= req.body;
        const productoActualizado= await productManager.updateProduct(id, updatedFields );
        res.json(productoActualizado)
    }
    catch(error){
res.status(500).json({error: error.message});
    }

router.delete('/:pid', async (req, res)=>{
    try {
        const id= parseInt(req.params.pid);
        const productoBorrado= await productManager.deleteProduct(id)
        res.json(productoBorrado);

    } catch (error) {
        res.status(500).json({error: error.message})
    };
});
});


export default router;
