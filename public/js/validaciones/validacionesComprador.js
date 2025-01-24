import validador from './validaciones.js';
import enviarDatosCompra from './sendDataCompra.js';
window.addEventListener("load", () => {
    let buttonSubmit = document.querySelector("#submit");
    let nombre = document.querySelector("#nombre");
    let apellido = document.querySelector("#apellido");
    let email = document.querySelector("#email");
    let provincia = document.querySelector("#provincia");
    let localidad = document.querySelector("#localidad");
    let calle = document.querySelector("#calle");
    let numeroCalle = document.querySelector("#numeroCalle");
    let numeroDocumento = document.querySelector("#dni");
    let campoErrores = document.querySelector("#errores");
    let expEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3,4})+$/;

    // Inputmask({ mask: "(99.999.999" }).mask(document.querySelector("#dni"));
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
                errorNumeroDocumento: numeroDocumentoValidacion()
            }
            if (hayErrores.errorEmail || hayErrores.errorApellido || hayErrores.errorNombre || hayErrores.errorProvincia 
                || hayErrores.errorLocalidad || hayErrores.errorCalle || hayErrores.errorNumeroCalle || hayErrores.errorNumeroDocumentoumeroDocumento) {
                event.preventDefault();
                validador.concatenarErroresCamposVacios();
            }
            else{
                validador.eliminarErrores();
                enviarDatosCompra(event,nombre.value,apellido.value,email.value,provincia.value,localidad.value,calle.value,numeroCalle.value,numeroDocumento.value)
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
        if (validador.validarCampoVacio(numeroCalle, 'numero de calle')){
            return true;
        }
        else if (isNaN(numeroCalle.value)) {
            let mensajeError = "Debe escribir numeros";
            validador.crearMensajeError(mensajeError);
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
        else if (isNaN(numeroDocumento.value)) {
            let mensajeError = "Debe escribir numeros";
            validador.crearMensajeError(mensajeError);
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
            let mensajeError = "Por favor, escribe un mail válido";
            validador.crearMensajeError(mensajeError);
            return true;
        }
        else {
            return false;
        }
    }
})


