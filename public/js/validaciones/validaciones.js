const Validador = {
    camposVacios: [],
    campoErrores: null,
    mensajeErrorCabecera: "Por favor completa los siguientes campos: ",

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

    eliminarErrores() {
        this.camposVacios = [];
        if (this.campoErrores) {
            this.campoErrores.innerHTML = "";
        }
    },

    concatenarErroresCamposVacios() {
        if (this.campoErrores) {
            const mensajeError = this.mensajeErrorCabecera + this.camposVacios.join(", ");
            this.crearMensajeError(mensajeError);
        }
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