import {body} from 'express-validator';
import dbAccesorios from '../models/accesoriosModel.js';
import executeTransaction from'../helpers/transactionHelper.js';

const validaciones = {
    crear : () => {
        return [
            body('nombreAccesorio')
                .notEmpty().withMessage("Completar"),
            body('codigoAccesorio')
                .notEmpty().withMessage("Completar") .custom(async (value) => {
                    await executeTransaction(async (connection) => {
                        let accesorio = await dbAccesorios.findById(connection, value);
                        if (accesorio)
                            throw new Error('Accesorio existente');
                      })
                })
        ]
    },
    actualizar: () => {
        return [
            body('nombreAccesorio')
                .notEmpty().withMessage("Completar")
        ]
    }
}


export default validaciones;