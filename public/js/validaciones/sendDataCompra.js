export default function enviarDatosCompra(event, nombre, apellido, email, provincia, localidad, calle, numeroCalle, numeroDocumento, numeroCelular, codigoPostal, datosAdicionales, validador) {
    event.target.disabled = true;
    event.preventDefault();
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    const datosFormulario = {};
    datosFormulario.nombre = nombre.value;
    datosFormulario.apellido = apellido.value;
    datosFormulario.email = email.value;
    datosFormulario.provincia = provincia.value;
    datosFormulario.localidad = localidad.value;
    datosFormulario.calle = calle.value;
    datosFormulario.numeroCalle = numeroCalle.value;
    datosFormulario.numeroDocumento = numeroDocumento.value;
    datosFormulario.numeroCelular = numeroCelular.value;
    datosFormulario.codigoPostal = codigoPostal.value;
    datosFormulario.datosAdicionales = datosAdicionales.value;
    datosFormulario.carrito = carrito;
    fetch('/comprar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosFormulario)
    })
      .then(response => response.text())
      .then(data => {
        data = JSON.parse(data);
        if (!data.hayError) {
          const step2 = document.querySelector('#step2')
          const step3 = document.querySelector('#step3')
          step3.classList.remove('hide');
          step2.classList.add('hide');
          validador.eliminarErrores();
          let popup = window.open(data.url, "MercadoPago", "width=1200,height=800");
        } else if (typeof(data.mensaje) === 'object') {
          let campoErrores = document.querySelector("#errores");
          if (data.mensaje?.msjCabeceraCamposVacios) {
            const p = document.createElement("p");
            p.textContent = data.mensaje.msjCabeceraCamposVacios;
            campoErrores.appendChild(p);
          }
          if (data.mensaje?.msjCabeceraCamposInvalidos) {
            const p = document.createElement("p");
            p.textContent = data.mensaje.msjCabeceraCamposInvalidos;
            campoErrores.appendChild(p);
          }
          campoErrores.classList.remove("hide");
        } else {
          M.toast({
            html: data.mensaje,
            classes: 'rounded red lighten-1',
            displayLength: 2000
          });
        }
        event.target.disabled = false;
      })
      .catch(error => console.error('Error:', error));
}