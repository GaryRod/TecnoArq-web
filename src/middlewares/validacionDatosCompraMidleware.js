import {body} from 'express-validator';

const validaciones = {
    compra : () => {
        return [
            body('nombre')
                .notEmpty().withMessage("nombre_vacio"),
            body('apellido')
                .notEmpty().withMessage("apellido_vacio"),
            body('numeroDocumento')
                .notEmpty().withMessage("DNI_vacio")
                .custom((value, {req})=> {
                    if (value.length < 8)
                        throw new Error ('DNI_invalido');
                    return true
                }),
            body('email')
                .notEmpty().withMessage("email_vacio")
                .custom((value, {req})=> {
                    const expEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3,4})+$/;
                    if (!expEmail.test(value))
                        throw new Error ('email_invalido');
                    return true
                }),
            body('provincia')
                .notEmpty().withMessage("provincia_vacio"),
            body('localidad')
                .notEmpty().withMessage("localidad_vacio"),
            body('calle')
                .notEmpty().withMessage("calle_vacio"),
            body('numeroCalle')
                .notEmpty().withMessage("nómero de calle_vacio"),
            body('numeroCelular')
                .notEmpty().withMessage("número celular_vacio")
                .custom((value, {req})=> {
                    if (!value.startsWith('11') || value.lenght < 8)
                        throw new Error ('número celular_invalido');
                    return true
                }),
            body('codigoPostal')
                .notEmpty().withMessage("código postal_vacio")
                .custom((value, {req})=> {
                    if (value.lenght < 4)
                        throw new Error ('código postal_invalido');
                    return true
                }),
        ]
    }
}


export default validaciones;