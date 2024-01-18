import  jwt  from "jsonwebtoken";
import {Usuario} from "../models/index.js"

const protegerRuta = async (req,res,next) => {

    //Verificar si hay un token
    const {_token} = req.cookies
    if(!_token){
        return res.redirect('/auth/login')
    }
    

    //Comprobar el token
    try {
        const decoded= jwt.verify(_token,process.env.JWT_SECRET)
        const usuario= await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        //Almacenar el usaurio req
        
        if(usuario){
            req.usuario=usuario
        }else{
            return res.redirect('/auth/login')
        }

        return next()
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
        
    }

};

const verficarUsuario = async (req,res,next) => {

    //Verificar si hay un token
    const {_token} = req.cookies
    if(!_token){
        req.usuario={}
        return next()
    }
    

    //Comprobar el token
    try {
        const decoded= jwt.verify(_token,process.env.JWT_SECRET)
        const usuario= await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        //Almacenar el usaurio req
        
        if(usuario){
            req.usuario=usuario
        }else{
            req.usuario={}
        }

        return next()
    } catch (error) {
        req.usuario={}
        return next()
    }

};

export { protegerRuta,verficarUsuario};