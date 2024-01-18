
import { check, validationResult } from "express-validator"
import Usuario from "../models/Usuario.js"
import { generarId,generarJWT } from "../helpers/tokens.js"
import { emailRegistro,emailOlvidePassword } from "../helpers/emails.js"
import bcrypt from "bcrypt";


const formularioLogin = async(req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken()
    })

   

}

const autenticar = async (req, res) => {
    await check('email').isEmail().withMessage("Eso no Parece un Email").run(req)
    await check('password').notEmpty().withMessage("El Password es Obligatorio").run(req)
    let resultado = validationResult(req)
    //Verificara que el resultado este vacio
    if (!resultado.isEmpty()) {
        //ERRORES
        return res.render('auth/login', {
            pagina: "Iniciar Sesion",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                email: req.body.email,
            }
        })
    }
    const { email, password } = req.body
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        return res.render('auth/login', {
            pagina: "Iniciar Sesion",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "El Usuario No existe" }],
            usuario: {
                email
            }
        })
    }

    //Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: "Iniciar Sesion",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "El Usuario no esta confirmado" }],
            usuario: {
                email
            }
        })
    }

    //Revisar el password
   if(!usuario.verificarPassword(password)){
    return res.render('auth/login', {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        errores: [{ msg: "El Password es Incorrecto" }],
        usuario: {
            email
        }
    })
   }

   const token = generarJWT({id:usuario.id,nombre:usuario.nombre})
   console.log('Valor de JWT_SECRET:', process.env.JWT_SECRET);
   //Almacenar en un cookie
   return res.cookie('_token', token, {
        httpOnly:true,
        //secure:true
   }).redirect('/mis-propiedades')


}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {

    res.render('auth/registro', {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
    //Validacion repetir_password
    await check('nombre').notEmpty().withMessage("El Nombre es Obligatorio").run(req)
    await check('email').isEmail().withMessage("Eso no Parece un Email").run(req)
    await check('password').isLength({ min: 6 }).withMessage("El Password debe ser Minimo de 6 Caracteress").run(req)
    await check('repetir_password').equals(req.body.password).withMessage("Los Password deben ser Iguales").run(req)
    let resultado = validationResult(req)
    //Verificara que el resultado este vacio
    if (!resultado.isEmpty()) {
        //ERRORES
        return res.render('auth/registro', {
            pagina: "Crear Cuenta",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,


            }
        })
    }

    //Extraer los datos
    const { nombre, email, password } = req.body

    //Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: "Crear Cuenta",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "El Usuario ya existe" }],
            usuario: {
                nombre,
                email

            }
        })
    }
    const usuario = await Usuario.create({
        nombre, email, password, token: generarId()
    })

    //Enviar Email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })
    //Mostrar Mensaje de confrimacion sin necesidad de crear un get
    res.render('templates/mensaje', {
        pagina: "Cuenta Creada Correctamente",
        mensaje: 'Hemos Enviado un Email de Confirmacion, presiona en el enlace'
    })
}

//Funcion para cnfirmar
const confirmar = async (req, res) => {
    const { token } = req.params
    //Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: "Error al Confirmar tu Cuenta",
            mensaje: "Hubo un error al confirmar tu cuenta",
            error: true
        })
    }
    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save()

    //Confrimado
    res.render('auth/confirmar-cuenta', {
        pagina: "Cuenta Confirmada",
        mensaje: "La cuenta de Confirmo Correctamente"

    })
}




const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: "Recupera tu Aceso a Bienes Raices",
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async(req, res) => {
    //Validacion repetir_password
    await check('email').isEmail().withMessage("Eso no Parece un Email").run(req)
    let resultado = validationResult(req)
    //Verificara que el resultado este vacio
    if (!resultado.isEmpty()) {
        //ERRORES
        return res.render('auth/olvide-password', {
            pagina: "Recupera tu Aceso a Bienes Raices",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
           
        })
    }

    //Buscar el usuario
    const { email } = req.body

    //Verificar que el usuario exista
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if (!existeUsuario) {
        return res.render('auth/olvide-password', {
            pagina: "Recupera tu Aceso a Bienes Raices",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "El Usuario no existe" }]
            
        })
    }
    
    existeUsuario.token=generarId()
    await existeUsuario.save()
    //Enviar Email de confirmacion
    emailOlvidePassword({
        nombre: existeUsuario.nombre,
        email: existeUsuario.email,
        token: existeUsuario.token
    })
    //Mostrar Mensaje de confrimacion sin necesidad de crear un get
    res.render('templates/mensaje', {
        pagina: "Restablece tu Password",
        mensaje: 'Hemos Enviado un Email con las instrucciones, presiona en el enlace'
    })
}

const comprobarToken = async(req, res) =>{
    const { token } = req.params
    const usuario = await Usuario.findOne({ where: { token } })
    if(!usuario){
        res.render('auth/confirmar-cuenta', {
            pagina: "Restablece tu Password ",
            mensaje: "Hubo un error al validar tu Información,intenta de nuevo",
            error: true
    
        })
    }

    //Mostrar furmulario para modificar el password
    res.render('auth/reset-password',{
        pagina: "Restablece tu Password",
        csrfToken: req.csrfToken()
        
    })
}

const nuevoPassword = async(req, res)=>{
    //validar el password
    await check('password').isLength({ min: 6 }).withMessage("El Password debe ser Minimo de 6 Caracteress").run(req)
    let resultado = validationResult(req)
    //Verificara que el resultado este vacio
    if (!resultado.isEmpty()) {
        //ERRORES
        return res.render('auth/reset-password', {
            pagina: "Restablece tu Password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
           
        })
    }

    //idnetificar el usuario
    const { token } = req.params
    const { password } = req.body
    const usuario = await Usuario.findOne({ where: { token } })
    usuario.token=null
    const salt = await bcrypt.genSalt(10)
    usuario.password= await bcrypt.hash(password,salt)
    await usuario.save()
    res.render('auth/confirmar-cuenta', {
        pagina: "Password Reestablecido",
        mensaje: "El Password se guardó  Correctamente"

    })
    
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar,
    cerrarSesion
}