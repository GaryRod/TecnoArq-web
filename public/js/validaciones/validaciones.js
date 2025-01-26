const Validador = {
    camposVacios: [],
    camposInvalidos: [],
    campoErrores: null,
    mensajeErrorCabeceraCampoVacio: "Por favor completa los siguientes campos: ",
    mensajeErrorCabeceraCampoInvalido: "Por favor complete con un formato válido los siguientes campos: ",

    setCampoErrores(campoErroresElement) {
        this.campoErrores = campoErroresElement;
    },

    validarCampoVacio(campo, datoIngresar) {
        if (campo.value === "") {
            this.camposVacios.push(datoIngresar);
            return true;
        } else {
            return false;
        }
    },

    agregarCampoInvalido(datoIngresar){
        this.camposInvalidos.push(datoIngresar)
    },

    eliminarErrores() {
        if (this.campoErrores) {
            this.campoErrores.innerHTML = "";
            this.camposInvalidos = [];
            this.camposVacios = [];
        }
    },

    enviarErroresCamposVacios() {
        if (this.campoErrores && this.camposVacios.length > 0) {
            const mensajeError = this.concatenarErrores(this.mensajeErrorCabeceraCampoVacio, this.camposVacios);
            this.crearMensajeError(mensajeError);
        }
    },

    enviarErroresCamposInvalidos() {
        if (this.campoErrores && this.camposInvalidos.length > 0) {
            const mensajeError = this.concatenarErrores(this.mensajeErrorCabeceraCampoInvalido, this.camposInvalidos);
            this.crearMensajeError(mensajeError);
        }
    },

    concatenarErrores(mensajeCabecera, camposAConcatenar){
        return mensajeCabecera + camposAConcatenar.join(", ");
    },

    crearMensajeError(mensajeError) {
        if (this.campoErrores) {
            const p = document.createElement("p");
            p.textContent = mensajeError;
            this.campoErrores.appendChild(p);
            this.campoErrores.classList.remove("hide");
        }
    }
};
export default Validador;