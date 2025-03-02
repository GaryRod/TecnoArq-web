import validador from './validaciones.js';
import enviarDatosCompra from './sendDataCompra.js';

window.addEventListener("load", () => {
    M.updateTextFields();
    const buttonSubmit = document.querySelector("#submit");
    const nombre = document.querySelector("#nombre");
    const apellido = document.querySelector("#apellido");
    const email = document.querySelector("#email");
    const provincia = document.querySelector("#provincia");
    const localidad = document.querySelector("#localidad");
    const calle = document.querySelector("#calle");
    const numeroCalle = document.querySelector("#numeroCalle");
    const numeroDocumento = document.querySelector("#dni");
    const numeroCelular = document.querySelector("#numeroCelular");
    const codigoPostal = document.querySelector("#codigoPostal");
    const datosAdicionales = document.querySelector("#datosAdicionales");
    const campoErrores = document.querySelector("#errores");
    const expEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3,4})+$/;

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
            const existeError = hayErrores.errorEmail || hayErrores.errorApellido || hayErrores.errorNombre || hayErrores.errorProvincia || hayErrores.errorLocalidad || 
            hayErrores.errorCalle || hayErrores.errorNumeroCalle || hayErrores.errorNumeroDocumentoumeroDocumento || hayErrores.errorNumeroCelular || hayErrores.errorCodigoPostal;
            if (existeError) {
                validador.enviarErroresCamposVacios();
                validador.enviarErroresCamposInvalidos();
            }
            else{
                enviarDatosCompra(event, nombre, apellido, email, provincia,localidad, calle, numeroCalle, numeroDocumento, numeroCelular, codigoPostal, datosAdicionales, validador)
            }
        } catch (error) {
            let mensajeError = "Error inesperado: " + error;
            validador.crearMensajeError(mensajeError)
        }
    })

    
    function nombreValidacion() {
        return validador.validarCampoVacio(nombre, 'nombre');
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
        if (validador.validarCampoVacio(codigoPostal, 'codigo postal')){
            return true;
        }
        else if (numeroDocumento.value.lenght < 4) {
            validador.agregarCampoInvalido("codigo postal");
            return true;
        }
        else {
            return false;
        }
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


