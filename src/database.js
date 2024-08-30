import mongoose from 'mongoose';


mongoose.connect("mongodb+srv://roxanaperrotta:roxanaperrottacoder@cluster0.ujdlb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Nos conectamos a mongoDB con mongoose");
}).catch((error)=>{
console.log("Tenemos un error en la conexion a mongoose")
});


