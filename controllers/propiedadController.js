import { validationResult } from "express-validator"
import {unlink} from 'node:fs/promises'
import { Categoria, Precio, Propiedad,Mensaje, Usuario } from "../models/index.js"
import { esVendedor, formatearFecha } from "../helpers/index.js"
import  fs from 'fs'






const perfil = async (req, res) => {

    const { id,nombre,email,imagen } = req.usuario
    

    res.render('auth/mi-perfil',{
        usuario:{id,nombre,email,imagen},
        csrfToken: req.csrfToken()
    })
    
}

const alamacenarImagenPerfil = async (req, res, next) => {
     // Accede a la información del archivo cargado
     console.log(req.file.filename)
     const usuario = await Usuario.findByPk(req.usuario.id)
    
   try {
    
    if(usuario.imagen){
        const imagenAnterioPath = `public/uploads/${usuario.imagen}`;
        console.log(imagenAnterioPath)
        // Eliminar archivo con filesystem
        fs.unlink( imagenAnterioPath, (error) => {
            if(error) {
                console.log(error);
            }
        });
    }
    usuario.imagen=req.file.filename
    await usuario.save()
    res.json({ success: "Imagen cargada exitosamente" });
   } catch (error) {
    console.log(error)
   }
};

const admin = async (req, res) => {
    //Leer QueryString
    const {pagina: paginaActual}=req.query


    //Expresion regular
    const expresion = /^[0-9]$/


    //Utilizar expresion
    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const { id } = req.usuario

        //Limites y Offset para el paginador
        const limit=10
        const offset=(paginaActual * limit)-limit

        const [propiedades,total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: { usuarioId: id },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    {model:Mensaje, as: 'mensajes' },
                ]
            }),
            Propiedad.count({
                where:{
                    usuarioId:id
                }
            })
        ])
        res.render('propiedades/admin', {
            pagina: "Mis Propiedades",
            propiedades,
            csrfToken: req.csrfToken(),
            paginas:Math.ceil(total/limit),
            paginaActual:Number(paginaActual),
            total,
            offset,
            limit
        })
    } catch (error) {
        console.log(error)
    }

  
}

const crear = async (req, res) => {
    //Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    res.render('propiedades/crear', {
        pagina: "Crear Propiedad",
        barra: true,
        categorias,
        precios,
        csrfToken: req.csrfToken(),
        datos: {}
    })
}


const guardar = async (req, res) => {
    //Validacion
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render('propiedades/crear', {
            pagina: "Crear Propiedad",
            categorias,
            precios,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            datos: req.body
        })
    }

    //Crear un registro
    const { titulo, descripcion, precio: precioId, categoria: categoriaId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body;


    const { id: usuarioId } = req.usuario
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ""
        })

        const { id } = propiedadGuardada;
        return res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.error(error)
    }
}

const agregarImagen = async (req, res) => {
    const { id } = req.params

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //validad que la propiedad pertenece a quien visiita 
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    return res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        propiedad,
        csrfToken: req.csrfToken(),
    })
}

const alamacenarImagen = async (req, res, next) => {
    const { id } = req.params

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //validad que la propiedad pertenece a quien visiita 
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    try {


        //alamacenar la iamgen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()
        next()
    } catch (error) {
        console.log(error)
    }


}

const editar = async (req, res) => {

    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //validad que la propiedad pertenece a quien visiita 
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    //Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        categorias,
        precios,
        csrfToken: req.csrfToken(),
        datos: propiedad,

    })
}

const guardarCambios = async (req, res) => {
    //berificar la validacion
    let resultado = validationResult(req)
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render('propiedades/editar', {
            pagina: "Editar Propiedad",
            categorias,
            precios,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            datos: req.body
    
        })
    }

    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //validad que la propiedad pertenece a quien visiita 
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    try{
       
        const { titulo, descripcion, precio: precioId, categoria: categoriaId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body;
       
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
           
        })
       
      
       await propiedad.save();
        res.redirect('/mis-propiedades')
    }catch(error){

    }

}

const eliminar = async(req,res)=>{
    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //validad que la propiedad pertenece a quien visiita 
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }
    
    //Eliminar la imagen asociada
    await unlink(`public/uploads/${propiedad.imagen}`)
    
    //Eliminar la propiedad
    await propiedad.destroy();
    
    res.redirect('/mis-propiedades');
    
}

const cambiarEstado = async (req, res, next) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    // Actualizar 
    propiedad.publicado = !propiedad.publicado;
    await propiedad.save();

    // Enviar respuesta JSON al cliente
    return res.json({
        resultado: true
    });

    // Si necesitas ejecutar algo después de enviar la respuesta, coloca el next() aquí.
    // next();
};


const mostrarPropiedad= async (req, res) => {
    const {id} = req.params

    //validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id,{
        include:[
            {model: Precio,as:'precio'},
            {model: Categoria,as:'categoria'}
        ]
    })
    //Le decimos que solo se traiga la columna imagen
    const usuario = await Usuario.findByPk(propiedad.usuarioId, {
        attributes: ['imagen','nombre']
      });

    
    if(!propiedad || !propiedad.publicado){
        return res.redirect('/404')
    }

    
    res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario:req.usuario,
        esVendedor:esVendedor(req.usuario?.id,propiedad.usuarioId),
        usuario

    })
}

const enviarMensaje = async (req, res) => {
    const {id} = req.params

    //validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id,{
        include:[
            {model: Precio,as:'precio'},
            {model: Categoria,as:'categoria'}
        ]
    })

    if(!propiedad){
        return res.redirect('/404')
    }

    //Renderizar
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
      
    return res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario:req.usuario,
        esVendedor:esVendedor(req.usuario?.id,propiedad.usuarioId),
        errores:resultado.array()

    })
    }

    const {mensaje} = req.body
    const {id:propiedadId} = req.params
    const {id:usuarioId} = req.usuario
    //alamecenar mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })


    return res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario:req.usuario,
        esVendedor:esVendedor(req.usuario?.id,propiedad.usuarioId),
        enviado:true
    })

}


//Leer mensajes resividos

const verMensajes= async (req, res) => {
    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id,{
        //para que se traiga el usuario que manda el mensaje si estuviera fuera no estaria trayendo el del mensaje traeria el de la propiedad
        include: [
            {model:Mensaje, as: 'mensajes',
        include: [
            {model:Usuario.scope('eliminarPassword'), as: 'usuario' },
        ]},
            
            
        ]
    })

    
    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //validad que la propiedad pertenece a quien visiita 
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes',{
      pagina:'Mensajes'  ,
      mensajes:propiedad.mensajes,
      formatearFecha
    });
}


export {
    admin,
    crear,
    guardar,
    agregarImagen,
    alamacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes,
    perfil,
    alamacenarImagenPerfil
}