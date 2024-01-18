import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'
import { request } from 'express'

const identificarUsuario= async (req,res,next) => {
    //Identificar usuario con token
    const {_token}= req.cookies
    if(!_token){
        req.usuario=null
        return next()
    }
    //comprobar el token
    try {
        const decoded= jwt.verify(_token,process.env.JWT_SECRET)
        const usuario= await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        if(usuario){
            req.usuario=usuario
        }

        return next()
    } catch (error) {
        console.log(error.message)
        return res.clearCookies('_token').redirect('/auth/login')
    }
    
}
export default identificarUsuario;