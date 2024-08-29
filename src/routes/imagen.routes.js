import {Router} from 'express';
import ImagenModel from '../dao/models/imagen.model.js';
import { upload } from '../uploader.js';
import {promises as fs} from "fs";

const router = Router ();

router.get('/', async(req, res)=>{
    const imagenes = await ImagenModel.find();
   const nuevasImagenes = imagenes.map( imagen=>{
        return{
            id:imagen._id,
            title:imagen.title,
            description:imagen.description,
            filename:imagen.filename,
            path:imagen.path
        }
    });
   
    res.render("index", {imagenes:nuevasImagenes});
});

router.get('/upload', async (req, res)=>{
    res.render('upload')
});

router.post('/upload', upload.single('image'), async (req, res)=>{
    try {
        const imagen = new ImagenModel();
        imagen.title=req.body.title;
        imagen.description=req.body.description;
        imagen.filename=req.file.filename;
        imagen.path="/img/" +req.file.filename;

        //guardamos imagen

        await imagen.save();

        res.status(500).send("Archivo subido exitosamente")

      


    } catch (error) {
        
        res.status(500).send({message: "error al cargar al servidor la imagen"});
    }
})

router.get("/image/:id/delete", async (req, res) => {
   
    const {id} = req.params; 
    const imagen = await ImagenModel.findByIdAndDelete(id); 
    await fs.unlink("./src/public" + imagen.path);
    res.redirect("/");
})


export default router;
