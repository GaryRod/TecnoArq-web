import validador from './validaciones.js';
import enviarDatosCompra from './sendDataCompra.js';

window.addEventListener("load", () => {
    M.updateTextFields();
    let buttonSubmit = document.querySelector("#submit");
    let nombre = document.querySelector("#nombre");
    let apellido = document.querySelector("#apellido");
    let email = document.querySelector("#email");
    let provincia = document.querySelector("#provincia");
    let localidad = document.querySelector("#localidad");
    let calle = document.querySelector("#calle");
    let numeroCalle = document.querySelector("#numeroCalle");
    let numeroDocumento = document.querySelector("#dni");
    let numeroCelular = document.querySelector("#numeroCelular");
    let codigoPostal = document.querySelector("#codigoPostal");
    let datosAdicionales = document.querySelector("#datosAdicionales");
    let campoErrores = document.querySelector("#errores");
    let expEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3,4})+$/;



    new Cleave('#dni', {
        numericOnly: true,
        blocks: [2,3,3]
    });

    new Cleave('#numeroCalle', {
        numericOnly: true,
        blocks: [10]
    });

    new Cleave('#dni', {
        numericOnly: false,
        blocks: [2,3,3]
    });

    new Cleave('#nombre', {
        delimiter: '',
        blocks: [50],
        onValueChanged: function (e) {
            const validText =  e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
            this.element.value = validText;
        }
    });

    new Cleave('#apellido', {
        delimiter: '',
        blocks: [50], 
        onValueChanged: function (e) {
            const validText = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
            this.element.value = validText;
        }
    });

    new Cleave('#calle', {
        delimiter: '',
        blocks: [50], 
        onValueChanged: function (e) {
            const validText = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
            this.element.value = validText;
        }
    });

    new Cleave('#localidad', {
        delimiter: '',
        blocks: [50], 
        onValueChanged: function (e) {
            const validText = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
            this.element.value = validText;
        }
    });

    new Cleave('#numeroCelular', {
        blocks: [2,4,4],
        numericOnly: true
    });

    new Cleave('#codigoPostal', {
        blocks: [4],
        numericOnly: true
    });

    new Cleave('#datosAdicionales', {
        delimiter: '',
        blocks: [150]
    });

    validador.setCampoErrores(campoErrores)
    buttonSubmit.addEventListener("click", (event) => {
        validador.eliminarErrores();
        try {
            let hayErrores = {
                errorEmail: emailValidacion(),
                errorNombre: nombreValidacion(),
                errorApellido: apellidoValidacion(),
                errorLocalidad: localidadValidacion(),
                errorProvincia: provinciaValidacion(),
                errorCalle: calleValidacion(),
                errorNumeroCalle: numeroCalleValidacion(),
                errorNumeroDocumento: numeroDocumentoValidacion(),
                errorNumeroCelular: numeroCelularValidacion(),
                errorCodigoPostal: codigoPostalValidacion()
            }
            if (hayErrores.errorEmail || hayErrores.errorApellido || hayErrores.errorNombre || hayErrores.errorProvincia || hayErrores.errorLocalidad || 
                hayErrores.errorCalle || hayErrores.errorNumeroCalle || hayErrores.errorNumeroDocumentoumeroDocumento || hayErrores.errorNumeroCelular || hayErrores.errorCodigoPostal) {
                event.preventDefault();
                validador.enviarErroresCamposVacios();
                validador.enviarErroresCamposInvalidos();
            }
            else{
                validador.eliminarErrores();
                enviarDatosCompra(event,nombre.value,apellido.value,email.value,provincia.value,localidad.value,calle.value,numeroCalle.value,numeroDocumento.value, numeroCelular.value, codigoPostal.value, datosAdicionales.value)
            }
        } catch (error) {
            let mensajeError = "Error inesperado: " + error;
            validador.crearMensajeError(mensajeError)
            event.preventDefault();
        }
    })

    
    function nombreValidacion() {
        return validador.validarCampoVacio(nombre, 'nombre');
    }

    function numeroCelularValidacion() {
        return validador.validarCampoVacio(numeroCelular, 'numero celular');
    }

    function apellidoValidacion() {
        return validador.validarCampoVacio(apellido, 'apellido');
    }

    function localidadValidacion() {
        return validador.validarCampoVacio(localidad, 'localidad');
    }

    function provinciaValidacion() {
        return validador.validarCampoVacio(provincia, 'provincia');
    }

    function calleValidacion() {
        return validador.validarCampoVacio(calle, 'calle');
    }

    function numeroCalleValidacion() {
        return validador.validarCampoVacio(numeroCalle, 'numero de calle');
    }

    function codigoPostalValidacion() {
        return validador.validarCampoVacio(codigoPostal, 'codigo postal');
    }

    function numeroDocumentoValidacion() {
        if (validador.validarCampoVacio(numeroDocumento, 'DNI')){
            return true;
        }
        else if (numeroDocumento.value.lenght < 8) {
            validador.agregarCampoInvalido("DNI");
            return true;
        }
        else {
            return false;
        }
    }

    function emailValidacion() {
        if(validador.validarCampoVacio(email, 'email')){
            return true;
        }
        else if (!expEmail.test(email.value)) {
            validador.agregarCampoInvalido("email");
            return true;
        }
        else {
            return false;
        }
    }

    function numeroCelularValidacion() {
        if (validador.validarCampoVacio(numeroCelular, 'número de celular')) {
            return true;
        }
        else if (!numeroCelular.value.startsWith('11') || numeroCelular.value.lenght < 8) {
            validador.agregarCampoInvalido("numero celular");
            return true;
        }
        else {
            return false;
        }
    }
})


