export default function enviarDatosCompra(event, nombre, apellido, email, provincia, localidad, calle, numeroCalle, numeroDocumento, numeroCelular, codigoPostal, datosAdicionales) {
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
        data = JSON.parse(data)
        // window.open(data.url);
        let popup = window.open(data.url, "MercadoPago", "width=1200,height=800");
        if (!popup || popup.closed || typeof popup.closed == "undefined") {
            alert("Por favor, habilita las ventanas emergentes para continuar con el pago.");
            return;
        }
        // let checkPopup = setInterval(() => {
        //     if (popup.closed) {
        //         clearInterval(checkPopup);
        //         window.location.href = "/pago/estado"; // Redirige a la página de estado del pago
        //     }
        // }, 1000);
        // createCheckoutBtn(data.id, mp)
        // const step2 = document.querySelector('#step2')
        // const step3 = document.querySelector('#step3')
        // step2.classList.add('hide');
        // step3.classList.remove('hide');
      })
      .catch(error => console.error('Error:', error));
}

function createCheckoutBtn(id, mp){
  if (window.checkoutButton) window.checkooutButton.unmount();
  const renderComponente = async () => {
    mp.bricks().create("wallet", "wallet_container", {
      initialization: {
          preferenceId: id,
          redirectMode: "blank"
      }
    });
  }
  renderComponente();
}