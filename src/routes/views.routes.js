import { Router} from "express";
import ProductManager from "../dao/db/product.manager.db.js";
import productModel from "../dao/models/products.model.js";

const router =  Router ();
const productManager = new ProductManager ();

router.get ('/products', async (req, res)=>{
    let page= req.query.page || 1
    let limit = 4
    
    const products = await productManager.getProducts();
    const listadoProductos= await productModel.paginate({}, {limit, page});
   // console.log(listadoProductos);

/*

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
*/

const productsResultadoFinal = listadoProductos.docs.map( prod =>{
   const {_id, ...rest} = prod.toObject();
   return rest;
  });
   res.render("home", {
       products:productsResultadoFinal,
       hasPrevPage:listadoProductos.hasPrevPage,
       hasNextPage:listadoProductos.hasNextPage,
       prevPage:listadoProductos.prevPage,
       nextPage:listadoProductos.nextPage,
       currentPage:listadoProductos.page,
       totalPages:listadoProductos.totalPages
   })
   //res.render('home', {products:nuevoArray});

   const ordenado = await productModel.aggregate([
      {
         
       //Ordenamos: 
          $sort: {
                 total: 1
    //             //1: ascendente
    //             //-1: descendente
           }
        }
    ])
     ordenado;
});



router.get ('/realtimeproducts', async (req, res)=>{
   // const products = await productManager.getProducts();
    res.render('realTimeProducts')
});

router.get ('/chat', async (req, res)=>{
    res.render('chat' )
});

export default router;