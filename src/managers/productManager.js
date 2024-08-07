import { promises as fs } from "fs";


class ProductManager{

    static ultId = 0;

    constructor (){
        
        this.products = []
        this.path = "products.json";
        this.initialize();
    };

    async initialize() {
        try {
            const fileContent = await fs.readFile(this.path, "utf8");
            this.products = JSON.parse(fileContent);
            if (this.products.length > 0) {
                ProductManager.ultId = Math.max(...this.products.map(product => product.id));
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, JSON.stringify([]));
            } else {
                console.error("Error initializing ProductManager:", error);
            }
        }
    }

     async addProduct(title, description, price, code, thumbnail="imagen no disponible",  stock=10){

   

    // Validación de inputs

    if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return;
    }

    //Revisar que no se dupliquen códigos

    if (this.products.some(item => item.code === code)) {
        console.log(`!!Atención: Producto no agregado. El producto con código ${code} ya existe.`);
        return;
    }

  // crear el producto nuevo

        const newProduct={
            id: ++ProductManager.ultId,
            title,
            description,
            price, 
            thumbnail, 
            code,
            stock

        }


//Agregar al array  

        this.products.push(newProduct);   
        await fs.writeFile(this.path, JSON.stringify (this.products, null, 2));
        return `Producto con código ${code} agregado`;


        
    };

//Obtener productos


async getProducts() { 
    try {
        const respuesta = await fs.readFile(this.path, "utf-8"); 
        const arrayProductos = await JSON.parse(respuesta);
        return arrayProductos;

    } catch (error) {
        console.log("Tenemos un error");
        throw error; 
    }
}

  
         
//Obtener producto por id

    async getProductById(id){

        try {
            const fileContent = await fs.readFile(this.path, "utf8");
            const productsById = JSON.parse(fileContent);
            const productoId = productsById.find(product => product.id === id);
            return productoId;
        } catch (error) {
            console.log("Tenemos un error");
            throw error;
        }
}

  async updateProduct (id, updatedFields){

    try {
        const fileContent = await fs.readFile(this.path, "utf8");
        this.products = JSON.parse(fileContent);

        let foundProduct = this.products.find(product => product.id === id);

        if (foundProduct) {
            Object.assign(foundProduct, updatedFields);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            return `El producto con ID ${id} fue modificado exitosamente.`;
        }

        return "Producto con es ID no encontrado";
    } catch (error) {
        console.log("Tenemos un error");
        throw error;
    }

    }

    async deleteProduct (id){

        try {
            const fileContent = await fs.readFile(this.path, "utf8");
            this.products = JSON.parse(fileContent);

            const index = this.products.findIndex(product => product.id === id);

            if (index !== -1) {
                this.products.splice(index, 1);
                await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
                return `El producto con ID ${id} fue eliminado exitosamente`;
            } else {
                return `Producto con ID ${id} no encontrado`;
            }
        } catch (error) {
            return `Error eliminando el producto. Error ${error}`;
        }
    }



}


const productManager = new ProductManager();


export default ProductManager;



