import {body} from 'express-validator';
import path from 'path';
import dbMarcas from '../models/marcasModel.js';
import executeTransaction from'../helpers/transactionHelper.js';

const validaciones = {
    crear : () => {
        return [
            body('marca')
                .notEmpty().withMessage("Completar"),
            body('codigo')
                .notEmpty().withMessage("Completar") .custom(async (value) => {
                    await executeTransaction(async (connection) => {
                        let marca = await dbMarcas.findById(connection, value);
                        if (marca)
                            throw new Error('Marca existente');
                      })
                }),
            body('archivo').custom((value, {req}) => {
                let file = req.file;
                let acceptedExtensions = ['.jpg', '.png', '.gif', '.jpeg'];
                if(file){
                    let fileExtension = path.extname(file.originalname);
                    if (!acceptedExtensions.includes(fileExtension))
                        throw new Error ('Las extensiones permitidas son .png, .jpg, .jpeg, .webp');
                }
                else
                    throw new Error ('Subir imagen');
                return true;
            })
        ]
    },
    actualizar: () => {
        return [
            body('marca')
                .notEmpty().withMessage("Completar")
        ]
    }
}


export default validaciones;