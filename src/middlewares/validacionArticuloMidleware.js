import {body} from 'express-validator';
import dbArticulos from '../models/articulosModel.js';
import executeTransaction from'../helpers/transactionHelper.js';

const validaciones = {
    crear : () => {
        return [
            body('codigo')
                .notEmpty().withMessage("Completar"),
            body('articulo')
                .notEmpty().withMessage("Completar") .custom(async (value) => {
                    await executeTransaction(async (connection) => {
                        let articulo = await dbArticulos.findById(connection, value);
                        if (articulo)
                            throw new Error('Articulo existente');
                      })
                }),
            body('precio')
                .notEmpty().withMessage("Completar")
                .custom((value, {req})=> {
                    if (value <= 0)
                        throw new Error ('Debe ser mayor a 0');
                    return true
                }),
            body('precioUSD')
                .notEmpty().withMessage("Completar")
                .custom((value, {req})=> {
                    if (value <= 0)
                        throw new Error ('Debe ser mayor a 0');
                    return true
                }),
        ]
    },
    actualizar: () => {
        return [
            body('articulo')
                .notEmpty().withMessage("Completar") .custom(async (value) => {
                    await executeTransaction(async (connection) => {
                        let articulo = await dbArticulos.findById(connection, value);
                        if (articulo)
                            throw new Error('Articulo existente');
                      })
                }),
            body('precio')
                .notEmpty().withMessage("Completar")
                .custom((value, {req})=> {
                    if (value <= 0)
                        throw new Error ('Debe ser mayor a 0');
                    return true
                }),
            body('precioUSD')
                .notEmpty().withMessage("Completar")
                .custom((value, {req})=> {
                    if (value <= 0)
                        throw new Error ('Debe ser mayor a 0');
                    return true
                }),
        ]
    }
}


export default validaciones;