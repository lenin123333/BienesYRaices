import Categoria from "./Categoria.js";
import Mensaje from "./Mensaje.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js";

//Precio.hasOne(Propiedad)

Propiedad.belongsTo(Precio,{foreignKey:'precioId'})
Propiedad.belongsTo(Categoria,{foreignKey:'categoriaId'})
Propiedad.belongsTo(Usuario,{foreignKey:'usuarioId'})
Propiedad.hasMany(Mensaje,{foreignKey:'propiedadId'})
Mensaje.belongsTo(Propiedad,{foreignKey:'propiedadId'})
Mensaje.belongsTo(Usuario,{foreignKey:'usuarioId'})

export {
    Categoria,
    Precio,
    Propiedad,
    Usuario,
    Mensaje
}