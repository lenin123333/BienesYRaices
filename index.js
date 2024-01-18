//const express = require('express'); //Estrae el paquete express esta funcion era usuada antes
import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import appRoutes from './routes/appRoutes.js'
import db from './config/db.js';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

//Crear la app
const app = express();


//Habilitar lectura de fromularios
app.use(express.urlencoded({extended: true}))

//Hablilitar cooki parse
app.use(cookieParser())

//Habilitar csrf
app.use(csrf({cookie:true}))


//conexion a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion exitosa a la base de datos');
} catch (error) {
    console.log(error);
}



//Habilitar pug le tenemos que decir cual habilitar
app.set('view engine', 'pug');
app.set('views','./views')

//Carpeta publica
app.use(express.static('public'))



//Routing 
//use buscara todas las rutas que inicien con unna / y las va a mostrar
app.use('/',appRoutes)
app.use('/auth',usuarioRoutes)
app.use('/',propiedadesRoutes)
app.use('/api',apiRoutes)


//Definir un puerto y arrancar el proyecto
const port= process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});