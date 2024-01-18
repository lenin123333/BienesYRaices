import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
    imagen: {
        type: DataTypes.STRING,
        allowNull: true // O el valor que desees
    }
},{
    hooks:{
        beforeCreate:async function (usuario) {
            const salt = await bcrypt.genSalt(10)
            usuario.password= await bcrypt.hash(usuario.password,salt)
        }
    },
    scopes:{
        eliminarPassword:{
            attributes:{
                exclude:['password','token','confirmado','createdAt','updatedAt']
            }   
        }
    }
});

// Ejecutar la consulta SQL para agregar la columna imagen
const agregarColumnaImagen = async () => {
    try {
        await db.query('ALTER TABLE usuarios ADD COLUMN imagen VARCHAR(255)');
        console.log('Columna imagen agregada correctamente');
    } catch (error) {
        console.error('Error al agregar la columna imagen: ', error);
    }
};

// Llamar a la función para agregar la columna imagen
agregarColumnaImagen();

// Métodos personalizados
Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

export default Usuario;
