import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/tokens.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //El destino de la iamgen
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        //extname es para traer la extension del archivo
        cb(null, generarId() + path.extname(file.originalname))
    }

})

const upload = multer({storage})

export default upload