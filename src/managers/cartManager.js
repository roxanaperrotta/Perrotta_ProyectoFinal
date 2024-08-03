
import { promises as fs } from "fs";

import ProductManager from "./productManager.js"
const productManager = new ProductManager ();



class CartManager{
    constructor (){
        this.path = "carts.json";
        this.carts = [];
        this.lastId = 0;

         // Cargar los carritos almacenados
         this.getCarts();

    };

  async getCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse (data);
            if (this.carts.length > 0) {
                // Al menos un elemento creado
                this.lastId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar los carritos", error);
            // Si el archivo no existe, crearlo
            await this.saveCarts();

        };
    };

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    } 
    
    async addCart(){

        const newCart={
            id: ++this.lastId,
            products: []
        };

        this.carts.push(newCart);

        await this.saveCarts();
        return newCart;

    };

    
    async getCartById(cartId){
      
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                throw new Error("No se encontró un carrito con ese ID");
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener carrito por ID");
            throw error;
        }
    };

     async addProductCart (cartId, productId, quantity=1){

            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(p => p.product === productId);

            if (!cart){
                return(`Carrito con id ${cartId} no encontrado`);
            }
            
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
    
            await this.saveCarts();
            return cart;
        }


   async deleteProduct (cartId, productId){
    try {
       this.getCarts();
       const cart = this.carts.find (cart=>cart.id===cartId);
       if (!cart){
      return(`Carrito con id ${cartId} no encontrado`);
    } 

    const productIndex=cart.products.findIndex(product=>product.id===parseInt(productId));
    if (productIndex ===-1){
       return(`Producto con id ${productId} en el carrito con id ${cartId} no encontrado`);
    }

    const product= cart.products[productIndex];
    if (product.quantity >1){
        product.quantity--;
    }else{
        cart.products.splice(productIndex, 1);

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    return cart;
    }

    } catch (error) {
        return("Error eliminando el producto del carrito", error);
    };  
   };
};

const cartManager = new CartManager();

export default CartManager;