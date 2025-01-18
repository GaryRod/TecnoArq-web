const dbArticulos = require('../models/articulosModel')
const dbMarcas = require('../models/marcasModel')

const mainController = {
    index: async (req, res) => {
        
        let articulos = await dbArticulos.getAll();
        let marcas = await dbMarcas.getAll();
        // let recomendados = productModel.buscado('recomendados');
        // let game = await db.Game.findAll({
        //     where: {
        //         genres_id: 1
        //     },
        //     include: ['images']
        // })
        // let game2 = await db.Game.findAll({
        //     where: {
        //         genres_id: 5
        //     },
        //     include: ['images']
        // })
        //  res.send("ok")
        res.render('./index',{articulos, marcas})
        // res.render('./index', {game, game2, recomendados})
    },
    // support: (req, res) => {
    //     res.render('./support')
    // }
}

module.exports = mainController