export default function enviarDatosCompra(event,nombre,apellido,email,provincia,localidad,calle,numeroCalle,numeroDocumento) {
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
        const step2 = document.querySelector('#step2')
        const step3 = document.querySelector('#step3')
        step2.classList.add('hide');
        step3.classList.remove('hide');
      })
      .catch(error => console.error('Error:', error));
}