import { Propiedad,Precio,Categoria } from "../models/index.js"

const propiedades = async(req,res)=>{
    const propiedades= await Propiedad.findAll({
        include:[
            {model:Precio, as:'precio'},
            {model:Categoria, as:'categoria'},
        ],
        where:{
            publicado:1
        }
    })
    res.json( propiedades)
}

export{
    propiedades
}