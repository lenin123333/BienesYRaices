import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config({path:'.env'})

const emailRegistro = async(datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST ,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    const {email,nombre,token} = datos
    //enviar email
    await transport.sendMail({
      from: 'BienesRaices.com',
      to: email,
      subject: 'Bienvenido a Bienes Raices,Confrima tu cuenta',
      text: 'Confirma tu cuenta en BienesRaices.com',
      html: `
      <h1>Bienvenido a Bienes Raices ${nombre}</h1>
      <p>Hemos Recibido un Email de Confirmacion, para activar tu cuenta haz click en el siguiente enlace</p>
      <a href="${process.env.BACKEND_URL}/auth/confirmar/${token}">Activar Cuenta</a>
      <p>Si no has recibido este email por favor ignora este mensaje</p>
      `
  })
}


const emailOlvidePassword = async(datos) =>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST ,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  const {email,nombre,token} = datos
  //enviar email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Bienvenido a Bienes Raices,Restablecce tu cuenta',
    text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
      <h1>Restablecce tu acceso a Bienes Raices ${nombre}</h1>
      <p>Hemos Recibido un Email , para volver activar tu cuenta haz click en el siguiente enlace</p>
      <a href="${process.env.BACKEND_URL}/auth/olvide-password/${token}">Restablecer Password</a>
      <p>Si no has recibido este email por favor ignora este mensaje</p>
   
    `
})
 
}


export {
    emailRegistro,
    emailOlvidePassword
}