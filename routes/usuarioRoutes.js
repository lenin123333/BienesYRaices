//Routing siempre vamos a tener un request y un response, el servidor lee que estamos entrando
// y nos devuelve la respuesta en este caso es lo de hola mundo
// render es para imprimir una vista 

import express  from "express"; 
import { formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    nuevoPassword,
    comprobarToken,
    cerrarSesion,
    autenticar } from "../controllers/usuarioController.js";

const router = express.Router();

//Get buscara la ruta que es esxacta 
// Esta es una manera
/*
router.get('/',function(req,res){
    res.send('Hola mundo en express')
})

router.post('/',function(req,res){
    res.json({
        msg: 'Respuesta tipo JSON'
    })
}) 

*/

//Pero contamos con una manera un poco mas viisible para leer el codigo se ocupa para controllers 
/*
router.route('/')
  .get(function(req,res){
        res.send('Hola mundo en express')
    })
    .post(function(req,res){
        res.json({
            msg: 'Respuesta tipo JSON'
        })
    })
*/

router.get('/login',formularioLogin)
router.post('/login',autenticar)
router.get('/registro',formularioRegistro)
router.post('/registro',registrar)
router.post('/cerrar-sesion',cerrarSesion)
//al tener estos dos puntos ya cuenta como una variable 
router.get('/confirmar/:token',confirmar)
router.get('/olvide-password',formularioOlvidePassword)
router.post('/olvide-password',resetPassword)
//alamcena el nuevo password
router.get('/olvide-password/:token',comprobarToken)
router.post('/olvide-password/:token',nuevoPassword)
export default router