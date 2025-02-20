$(document).ready(function() {
  $('.sidenav').sidenav();
  $('.parallax').parallax();
  const modalAccesorios = document.querySelector('#modalAccesorios');
  let instanceModalAccesorios = M.Modal.init(modalAccesorios, {
    onCloseStart: function (e, trigger) {
        const contentsAccesorios = document.querySelectorAll("#content-accesorio");
        contentsAccesorios.forEach(element => {
          element.remove();
      })
    },
    onOpenStart: function (e, trigger) {
      const button = trigger.closest("li").querySelector(".agregarArticulo");
      const codigoArt = button.getAttribute("data-codigo")
      const dataArt = {
        codigoArt
      }
      fetch('/accesoriosArticulo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataArt)
      })
      .then(response => response.text())
      .then(data => {
        const container = e.querySelector(".modal-content");
        container.setAttribute("data-codigoArticulo", codigoArt);
        data = JSON.parse(data);
        for (const accesorio of data.accesorios) {
          const accesorioAgregar = `<div class="col s12 m2" id="content-accesorio" style="margin-top: 16px; 
                                    display: flex; align-items: center; justify-content: center;">
                                      <div class="col s12 m5">
                                        <input type="text" class="nombreAccesorio" placeholder="Nombre" value="${accesorio.nombre}" readonly/>
                                      </div>
                                    </div>`
          container.insertAdjacentHTML("beforeend", accesorioAgregar);
        }
      })
      .catch(error => {
        M.toast({
          html: `Ocurrió un error al grabar, ${error}`,
          classes: 'rounded red lighten-1',
          displayLength: 2000
        });
      });
    }
  });

  
  const modal = document.querySelector('#modalCompra');
  let instance = M.Modal.init(modal, {dismissible: false});
    
  const step1 = document.querySelector('#step1')
  const step2 = document.querySelector('#step2')
  const step3 = document.querySelector('#step3')
  const next = document.querySelector('#next')
  const prev = document.querySelector('#prev')
  const comprar = document.querySelector('#submit')
  const finalizar = document.querySelector('#finalizar')
  next.addEventListener('click', e => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length > 0) {
      step1.classList.add('hide');
      step2.classList.remove('hide');
    }
  })

  prev.addEventListener('click', e => {
    step1.classList.remove('hide');
    step2.classList.add('hide');
  })

  comprar.addEventListener("click", e => {
    step3.classList.remove('hide');
    step2.classList.add('hide');
  })
  
  finalizar.addEventListener('click', e => {
    instance.close(modal);
    limpiarCarrito(true);
    step1.classList.remove('hide');
    step3.classList.add('hide');
  })
})

const formato = new Intl.NumberFormat('es-AR', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

document.querySelector("#containerProducts").addEventListener('click', e => {
  if (e.target.classList.contains('agregarArticulo')) {
    const product = e.target.dataset;
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.find(art => art.codigo === product.codigo)) {
      carrito.forEach(art => {
        if (art.codigo === product.codigo) {
          art.cantidad++;
          const precioUnitario = Number(product.precio.replaceAll(".","").replace(",","."));
          const precioActualizado = Math.round((precioUnitario * art.cantidad) * 100) / 100;;
          art.precio = formato.format(precioActualizado);
        }
      })
      localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    else{
      const articulo = {
        codigo: product.codigo,
        nombre: product.nombre,
        precio: product.precio,
        precioUnitario: product.precio,
        preciousd: product.preciousd,
        cantidad: 1
      }
      carrito.push(articulo);
    }
    limpiarCarrito(true);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    M.toast({
      html: 'Se agregó el articulo',
      classes: 'rounded green lighten-1',
      displayLength: 2000
    });
  }
})

document.querySelector("#containerArtsCarrito").addEventListener('click', e => {
  let limpiarStorage = false;
  const elementoActual = e.target;
  const product = elementoActual.parentElement.dataset;
  const rowCarrito = elementoActual.closest(".rowCarrito");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const cantidadArticulo = rowCarrito.querySelector(".cantidadCarrito");
  let precioArticulo = rowCarrito.querySelector(".precioCarrito");
  let precioUnitarioArticulo = precioArticulo.getAttribute("data-precioUnitario");
  if (elementoActual.classList.contains('sumarArticulo')) {
    let cantidadActualizada = Number(cantidadArticulo.textContent) + 1
    precioUnitarioArticulo = Number(precioUnitarioArticulo.replaceAll(".","").replace(",","."))
    let precioActualizado = Math.round((precioUnitarioArticulo * cantidadActualizada) * 100) / 100
    cantidadArticulo.textContent = cantidadActualizada;
    precioArticulo.textContent = "$" + formato.format(precioActualizado);
    limpiarStorage = true;
    carrito.forEach(art => {
      if (art.codigo === product.codigo) {
        art.cantidad = cantidadActualizada;
        art.precio = formato.format(precioActualizado);
      }
    })
  } 
  else if (e.target.classList.contains('restarArticulo')){
    let cantidadActualizada = Number(cantidadArticulo.textContent) - 1;
    precioUnitarioArticulo = Number(precioUnitarioArticulo.replaceAll(".","").replace(",","."));
    let precioActualizado = Math.round((precioUnitarioArticulo * cantidadActualizada) * 100) / 100;
    limpiarStorage = true;
    if (cantidadActualizada > 0) {    
      cantidadArticulo.textContent = cantidadActualizada;
      precioArticulo.textContent = "$" + formato.format(precioActualizado);
      carrito.forEach(art => {
        if (art.codigo === product.codigo) {
          art.cantidad = cantidadActualizada;
          art.precio = formato.format(precioActualizado);
        }
      })
    } else {
      const product = elementoActual.parentElement.dataset;
      let indice = carrito.findIndex(art => art.codigo === product.codigo);
      carrito.pop(indice);
      elementoActual.parentElement.parentElement.removeChild(elementoActual.parentElement)
    }
  }
  else if (elementoActual.classList.contains('eliminarArticulo')){
    const product = elementoActual.parentElement.dataset;
    let indice = carrito.findIndex(art => art.codigo === product.codigo);
    carrito.pop(indice);
    elementoActual.parentElement.parentElement.removeChild(elementoActual.parentElement)
    limpiarStorage = true;
  }
  if (limpiarStorage) {
    limpiarCarrito(false);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
})

document.querySelector("#carritoCompra").addEventListener("click", e => {
  const containerArts = document.querySelector("#containerArtsCarrito");
  containerArts.innerHTML = '';
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.forEach(art => {
    const div = document.createElement('div');
    div.classList.add('rowCarrito')
    div.classList.add('row')
    div.setAttribute('data-codigo', art.codigo)
    let agregarArticulo = `<div class="detallesCarrito">
                            <span class="column col s2 nombreCarrito">${art.nombre}</span>
                            <span class="column col s2 precioCarrito" data-precioUnitario="${art.precioUnitario}">$${art.precio}</span>
                            <span class="column col s1 cantidadCarrito">${art.cantidad}</span>
                             </div>
                          <div class="accionesCarrito">
                            <span class="column col s1 restarArticulo estiloCarrito">-</span>
                            <span class="column col s1 sumarArticulo estiloCarrito">+</span>
                            <span class="column col s2 eliminarArticulo"> 
                              <button class="btn btn-small red accent-4 delete-btn" >
                                <i class="material-icons">delete</i>
                              </button>
                            </span>
                          </div>
                          `;
    div.innerHTML = agregarArticulo;
    containerArts.appendChild(div);
  })

})

document.querySelector("#limpiarCarrito").addEventListener("click", e => {
  limpiarCarrito(true);
})

function limpiarCarrito(limpiarHTML){
  if (limpiarHTML) {
    const containerArts = document.querySelector("#containerArtsCarrito");
    containerArts.innerHTML = '';
  }
  localStorage.removeItem("carrito");
}

  // Inicialización de Materialize para collapsibles
  document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.collapsible.expandable');
    const instances = M.Collapsible.init(elems, {
      accordion: false,
      onOpenStart: function(el) {
        const arrow = el.querySelector('.arrow-icon');
        if (arrow) arrow.classList.add('rotate'); // Añade la clase rotate
      },
      onCloseStart: function(el) {
        const arrow = el.querySelector('.arrow-icon');
        if (arrow) arrow.classList.remove('rotate'); // Remueve la clase rotate
      }
    });
  });