import fs from "fs";


class ProductManager{

    static ultId = 0;

    constructor (){
        
        this.products = []
        this.path = "products.json";
    };


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

        this.products.push(newProduct)   
        await fs.promises.writeFile(this.path, JSON.stringify (this.products, null, 2))
        return `Producto con código ${code} agregado`;


        
    };

//Obtener productos


async getProducts() { 
    try {
        const newArray = await this.leerArchivo(); 
        return newArray;
    } catch (error) {
        console.log("Tenemos un error");
        throw error; 
    }
}

    async leerArchivo() {
        const respuesta = await fs.promises.readFile(this.path, "utf-8");
        const arrayProductos = await JSON.parse(respuesta);
        return arrayProductos;
    }
         
//Obtener producto por id

    async getProductById(id){

        if ((this.filePath)){
            let fileContent =  await fs.promises.readFile (this.file, 'utf8');
             //console.log(fileContent)
            const productsById = await JSON.parse(fileContent);
            const productoId= await productsById.find(product=>product.id===id);
            return productoId;
        }
}

  async updateProduct (id, updatedFields){

        let foundProduct = this.products.find(product=>product.id===id)

        if (foundProduct){
            let selectedProduct = foundProduct;
            await Object.assign(selectedProduct, updatedFields);
            const updatedProductString = JSON.stringify(this.products, null, 2)
            await fs.promises.writeFile(this.file, updatedProductString);
            console.log(foundProduct)
            return `El producto con ID ${id} fue modificado exitosamente. `
        }


        return "Producto con es ID no encontrado"

    }

    async deleteProduct (id){

        let foundProduct = this.products.find(product=>product.id===id)

        if (foundProduct){

            let index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
                this.products.splice(index, 1);
            }

            try {
                const fileContent = await fs.promises.readFile(this.path, 'utf8')
                const data = JSON.parse(fileContent)
                const updatedData = data.filter(product=>product.id!== id);
                fs.promises.writeFile(this.path, JSON.stringify(updatedData, null, 2));
                console.log (this.products);
                return `El producto con ID ${id} fue eliminado exitosamente`

            } catch (error) {
                return `Error eliminando el producto. Error ${error}`
            }
        }
        else{
            return `Producto con ID ${id} no encontrado`
        }
    }



}


const productManager = new ProductManager();


export default ProductManager;

productManager.addProduct("sandia", "fruta", 2000, "none");

