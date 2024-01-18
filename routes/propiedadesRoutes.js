import express from "express";
import {
    perfil,
    verMensajes,
    admin, crear,
    guardar, agregarImagen,
    alamacenarImagen, editar,
    guardarCambios, eliminar,
    cambiarEstado, mostrarPropiedad,
    enviarMensaje,
    alamacenarImagenPerfil
} from "../controllers/propiedadController.js";
import { body } from "express-validator";
import {protegerRuta} from "../middleware/protegerRuta.js";
import upload from "../middleware/subirArchivo.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();


router.get('/mis-propiedades', protegerRuta, admin)
router.get('/mi-perfil', protegerRuta, perfil)
router.post('/mi-perfil/agregar-imagen',
protegerRuta,
    upload.single('imagen'),
    alamacenarImagenPerfil
)

router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion no puede ir vacia').isLength({ max: 100 }).withMessage("La descripcion es muy larga"),
    body('categoria').isNumeric().withMessage("Selecciona una categoria"),
    body('precio').isNumeric().withMessage("Selecciona una rango de precios"),
    body('habitaciones').isNumeric().withMessage("Selecciona una cantidad de habitaciones"),
    body('estacionamiento').isNumeric().withMessage("Selecciona una cantidad de estacionamientos"),
    body('wc').isNumeric().withMessage("Selecciona una cantidad de WC"),
    body('lat').notEmpty().withMessage("Ubica la Propiedad en el mapa"),
    guardar)
router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)
router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    alamacenarImagen
)


router.get('/propiedades/editar/:id',
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id', protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion no puede ir vacia').isLength({ max: 100 }).withMessage("La descripcion es muy larga"),
    body('categoria').isNumeric().withMessage("Selecciona una categoria"),
    body('precio').isNumeric().withMessage("Selecciona una rango de precios"),
    body('habitaciones').isNumeric().withMessage("Selecciona una cantidad de habitaciones"),
    body('estacionamiento').isNumeric().withMessage("Selecciona una cantidad de estacionamientos"),
    body('wc').isNumeric().withMessage("Selecciona una cantidad de WC"),
    body('lat').notEmpty().withMessage("Ubica la Propiedad en el mapa"),
    guardarCambios)

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
);

router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado);
//area publica
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
)

//Alamcenar los mensajes
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({ min: 20 }).withMessage('El mensaje es muy corto o va vacio'),
    enviarMensaje,
)

router.get('/mensajes/:id',
    protegerRuta,
    verMensajes
)

export default router