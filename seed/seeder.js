import db from "../config/db.js";
import { Categoria,Precio,Usuario } from "../models/index.js";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import {exit} from "node:process"
const importarDatos = async ()=>{
    try {
        //Autenticar en la base de datos
        await db.authenticate()
        //generar columnas de la base datos
        await db.sync()
        //insertar datos
        
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])
        //exit en 0 o nada signifca que si terminar la ejecución fue correcto
        // con 1 es porque hay un error
        exit()

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


const eliminarDatos= async () => {
    try {
      //  await Promise.all([
        //    Categoria.destroy({where:{},truncate:true}),
          //  Precio.destroy({where:{},truncate:true})
            
        //])
        //otra forma
        await db.sync({force:true})
        exit()
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


if(process.argv[2]==="-i"){
    importarDatos()
}

if(process.argv[2]==="-e"){
    eliminarDatos()
}