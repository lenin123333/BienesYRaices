import express from 'express';
import {inicio,categoria,buscador,noEncotrado} from '../controllers/appController.js'
import { verficarUsuario } from '../middleware/protegerRuta.js';
const router = express.Router()

//Pagina incio
router.get('/',verficarUsuario,inicio)

//Categorias
router.get('/categorias/:id',verficarUsuario,categoria)

//Pagina 404 
router.get('/404',noEncotrado) 

//Buscador
router.post('/buscador',verficarUsuario, buscador)

export default router;