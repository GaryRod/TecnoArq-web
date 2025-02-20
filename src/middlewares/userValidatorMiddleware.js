import {body} from 'express-validator';
const validaciones = [
    body('username')
        .notEmpty().withMessage("Debes escribir un usuario"),
    body('password')
        .notEmpty().withMessage("Debes escribir una contraseña")
]
export default validaciones;