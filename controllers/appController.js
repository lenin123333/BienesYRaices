import { Sequelize } from "sequelize"
import { Propiedad,Precio,Categoria } from "../models/index.js"

const inicio=async(req,res)=>{

    const[categorias,precios,casas,departamentos] = await Promise.all([
        Categoria.findAll({raw:true}),
        Precio.findAll({raw:true}),
        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId:1,
                publicado:1
            },
            include:[
                {
                    model:Precio,
                    as:'precio'
                }
            ],
            order:[['createdAt','DESC']]
        }),
        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId:2,
                publicado:1
            },
            include:[
                {
                    model:Precio,
                    as:'precio'
                }
            ],
            order:[['createdAt','DESC']]
        })

    ])

    if(req.usuario){
        res.render('inicio',{
            pagina:'Inicio',
            categorias,
            precios,
            casas,
            departamentos,
            csrfToken: req.csrfToken(),
            usuario:req.usuario.nombre
        })
    }else{
        res.render('inicio',{
            pagina:'Inicio',
            categorias,
            precios,
            casas,
            departamentos,
            csrfToken: req.csrfToken()
           
        })
    }

   
}

const categoria=async (req,res)=>{
    const {id}=req.params
    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if(!categoria){
        return res.redirect('/404')
    }

    const propiedades = await Propiedad.findAll({
        where:{
            categoriaId:id,
            publicado:1
        },
        include:[
            {model:Precio, as: 'precio'}
        ]
    })

    if(req.usuario){
        res.render('categoria',{
            pagina:`Categoria ${categoria.nombre} en Venta`,
            propiedades,
            csrfToken: req.csrfToken(),
            usuario:req.usuario.nombre
        })

    }else{
        res.render('categoria',{
            pagina:`Categoria ${categoria.nombre} en Venta`,
            propiedades,
            csrfToken: req.csrfToken()
        })
    }
   

    //obtener las propiedades
}

const noEncotrado=(req,res)=>{
    res.render('404',{
        pagina:'No Encotrado',
        csrfToken: req.csrfToken()
    })
}

const buscador=async(req,res)=>{
    const {termino}=req.body
    //validar que termino no este vacio
    if(!termino.trim()){
        return res.redirect('back');
    }

    //Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo:{
                [Sequelize.Op.like] : '%' + termino + '%'
            },
            publicado:1
        },
        include:[{
            model:Precio, as:'precio'
        }]
    })

    if(req.usuario){
        res.render('busqueda',{
            pagina:'Resultado de la busqueda',
            propiedades,
            csrfToken: req.csrfToken(),
            usuario:req.usuario.nombre
        })

    }else{
        res.render('busqueda',{
            pagina:'Resultado de la busqueda',
            propiedades,
            csrfToken: req.csrfToken()
        })
    }
   
}

export{
    inicio,categoria,buscador,noEncotrado
}