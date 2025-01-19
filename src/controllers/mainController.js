const dbArticulos = require('../models/articulosModel')
const dbMarcas = require('../models/marcasModel')

const mainController = {
    index: async (req, res) => {
        
        let articulos = await dbArticulos.getAll();
        let marcas = await dbMarcas.getAll();
        res.render('./index',{articulos, marcas})
    },
    // support: (req, res) => {
    //     res.render('./support')
    // }
}

module.exports = mainController