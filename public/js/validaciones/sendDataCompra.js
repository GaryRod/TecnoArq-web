export default function enviarDatosCompra(event, nombre, apellido, email, provincia, localidad, calle, numeroCalle, numeroDocumento, numeroCelular, codigoPostal, datosAdicionales) {
    event.target.disabled = true;
    event.preventDefault();
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    const datosFormulario = {};
    datosFormulario.nombre = nombre;
    datosFormulario.apellido = apellido;
    datosFormulario.email = email;
    datosFormulario.provincia = provincia;
    datosFormulario.localidad = localidad;
    datosFormulario.calle = calle;
    datosFormulario.numeroCalle = numeroCalle;
    datosFormulario.numeroDocumento = numeroDocumento;
    datosFormulario.numeroCelular = numeroCelular;
    datosFormulario.codigoPostal = codigoPostal;
    datosFormulario.datosAdicionales = datosAdicionales;
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
        let popup = window.open(data.url, "MercadoPago", "width=1200,height=800");
        if (!popup || popup.closed || typeof popup.closed == "undefined") {
            alert("Por favor, habilita las ventanas emergentes para continuar con el pago.");
            return;
        }
        event.target.disabled = false;
      })
      .catch(error => console.error('Error:', error));
}