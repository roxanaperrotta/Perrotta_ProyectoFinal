import mongoose from 'mongoose';
import UserModel from './dao/models/usuario.model.js';
import alumnoModel from './dao/models/alumnos.model.js';
import cursoModel from './dao/models/curso.model.js';

mongoose.connect("mongodb+srv://roxanaperrotta:roxanaperrottacoder@cluster0.ujdlb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Nos conectamos a mongoDB con mongoose");
}).catch((error)=>{
console.log("Tenemos un error en la conexion a mongoose")
});

/*const respuesta = await UserModel.find({edad:{$lt:18}}).explain("executionStats");
await UserModel.find({nombre:"Carlos"}).explain("executionStats");
console.log(respuesta);
*/
/*
const respuestaAlumnos= await alumnoModel.find();
console.log(respuestaAlumnos);
*/

//Busco un estudiante y un curso

const estudiante = await alumnoModel.findById('66cfd04b1a3fd942c6627c0a');

const cursoBackend = await cursoModel.findById('66cfce071a3fd942c6627c05');

console.log(estudiante);
console.log(cursoBackend);

//ingreso el curso al alumno

//estudiante.cursos.push(cursoBackend);

//Actualizo el documento

//await alumnoModel.findByIdAndUpdate("66cfd04b1a3fd942c6627c0a", estudiante);

//se pude ver el alumno con cursos

const alumnoConCursos = await alumnoModel.findById("66cfd04b1a3fd942c6627c0a").populate("cursos");

console.log(alumnoConCursos);
