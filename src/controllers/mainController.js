import dbArticulos from'../models/articulosModel.js';
import dbArticuloAccesorios from'../models/articuloAccesoriosModel.js';
import dbAccesorios from'../models/accesoriosModel.js';
import dbMarcas from'../models/marcasModel.js';
import executeTransaction from'../helpers/transactionHelper.js';
import mercadoPago from'../helpers/mercadoPagoHelper.js';
import {validationResult} from 'express-validator';

const mainController = {
    index: async (req, res) => {
        await executeTransaction(async (connection) => {
            let articulos = await dbArticulos.getAll(connection);
            let articulosUtilizables = articulos.filter(art => art.utilizable);
            for (const articulo of articulosUtilizables)
                articulo.existeRefernecia = await dbArticuloAccesorios.existReferencesByCodArtUtilizables(connection, articulo.codigo);
            let marcas = await dbMarcas.getAll(connection);
            let marcasUtilizables = marcas.filter(marca => marca.utilizable);
            res.render('./index',{articulos: articulosUtilizables, marcas: marcasUtilizables})
        })
    },

    
  accesoriosArticulo: async (req, res) => {
    try {
      await executeTransaction(async (connection) => {
        const body = req.body;
        let accesorios = await dbAccesorios.getAll(connection);
        accesorios = accesorios.filter(acc => acc.utilizable)
        for (const accesorio of accesorios) {
          const accesorioArticulo = await dbArticuloAccesorios.findByIds(connection, body.codigoArt, accesorio.codigo)
          accesorio.existeAccesorioArticulo = accesorioArticulo ? true : false;
        }
        accesorios = accesorios.filter(acc => acc.existeAccesorioArticulo)
        res.json({accesorios});
      })
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

    comprar: async (req, res) => {
      try {
        let hayError = false;
        const errores = validationResult(req);
        hayError = errores.errors.length > 0;
        let response;
        let mensaje = {};
        if (hayError) {
          let msjCabeceraCamposVacios = "Por favor completa los siguientes campos: ";
          let msjCabeceraCamposInvalidos = "Por favor complete con un formato válido los siguientes campos: ";
          let erroresVacios = [];
          let erroresInvalidos = [];
          for (const element of Object.keys(errores.mapped())) {
            let mensajeError = errores.mapped()[element].msg;
            if (mensajeError.includes('_vacio')) {
              erroresVacios.push(mensajeError.replace('_vacio', ''));
            } else if (mensajeError.includes('_invalido')) {
              erroresInvalidos.push(mensajeError.replace('_invalido', ''));
            }
          }
          if (erroresVacios.length > 0) {
            const errorCamposVacios = erroresVacios.join(", ");
            msjCabeceraCamposVacios += errorCamposVacios;
            mensaje.msjCabeceraCamposVacios = msjCabeceraCamposVacios;
          }
          if (erroresInvalidos.length > 0) {      
            const errorCamposInvalidos = erroresInvalidos.join(", ");
            msjCabeceraCamposInvalidos += errorCamposInvalidos;
            mensaje.msjCabeceraCamposInvalidos = msjCabeceraCamposInvalidos;
          }
        } else {
          const body = req.body;
          response = await mercadoPago.crearOrden(body);
        }
        res.json({hayError, mensaje: mensaje, url: response});
      } catch (error) {
        res.json({hayError: true, mensaje: `Error inesperado`});
      }
    },
    
    comprobar: async (req, res) => {
        await mercadoPago.validarPago(req,res);
    }
}

export default mainController