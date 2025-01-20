window.addEventListener("load", () => {
    let formulario = document.querySelector("#submitDatos");
    let nombre = document.querySelector("#nobmre");
    let apellido = document.querySelector("#apellido");
    let email = document.querySelector("#email");
    let provincia = document.querySelector("#provincia");
    let localidad = document.querySelector("#localidad");
    let calle = document.querySelector("#calle");
    let numeroCalle = document.querySelector("#numeroCalle");
    let numeroDocumento = document.querySelector("#numeroDocumento");
    let campoErrores = document.querySelector("#errores");
    let expEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3,4})+$/;

    formulario.addEventListener("submit", (event) => {
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
        }
    })

    email.addEventListener("blur", emailValidacion);
    nombre.addEventListener("blur", nombreValidacion);
    apellido.addEventListener("blur", apellidoValidacion);
    localidad.addEventListener("blur", localidadValidacion);
    provincia.addEventListener("blur", provinciaValidacion);
    calle.addEventListener("blur", calleValidacion);
    numeroCalle.addEventListener("blur", numeroCalleValidacion);
    numeroDocumento.addEventListener("blur", numeroDocumentoValidacion);

   
    function nombreValidacion() {
        return validarCampoVacio(nombre, 'nombre');
    }

    function apellidoValidacion() {
        return validarCampoVacio(apellido, 'apellido');
    }

    function localidadValidacion() {
        return validarCampoVacio(localidad, 'localidad');
    }

    function provinciaValidacion() {
        return validarCampoVacio(provincia, 'provincia');
    }

    function calleValidacion() {
        return validarCampoVacio(calle, 'calle');
    }

    function numeroCalleValidacion() {
        if (validarCampoVacio(numeroCalle, 'numeroCalle')){
            return true;
        }
        else if (isNaN(numeroCalle.value)) {
            let mensajeError = "Debe escribir numeros";
            crearMensajeError(mensajeError);
            return true;
        }
        else {
            return false;
        }
    }

    function numeroDocumentoValidacion() {
        if (validarCampoVacio(numeroDocumento, 'numeroDocumento')){
            return true;
        }
        else if (isNaN(numeroDocumento.value)) {
            let mensajeError = "Debe escribir numeros";
            crearMensajeError(mensajeError);
            return true;
        }
        else {
            return false;
        }
    }

    function emailValidacion() {
        if(validarCampoVacio(email, 'email')){
            return true;
        }
        else if (!expEmail.test(email.value)) {
            let mensajeError = "Por favor, escribe un mail válido";
            crearMensajeError(mensajeError);
            return true;
        }
        else {
            return false;
        }
    }

    function validarCampoVacio(campo, datoIngresar) {
        if(campo.value === "") {
            let mensajeError = `Debes ingresar ${datoIngresar}`;
            crearMensajeError(mensajeError);
            return true;
        } 
        else {
            return false;
        }
    }

    function eliminarErrores(campo){
        let identificadorDIV = "ul-errores-contraseña";
        // writeMsg({identificadorDIV, mensajeError: ""});
        campo.classList.remove("errorFatal");
        campo.classList.remove("errorFatalLetras");
        return false;
    }

    function crearMensajeError(mensajeError){
        let span = document.createElement("span")
        span.textContent = mensajeError;
        campoErrores.appendChild(span)
    }
})


