$(document).ready(function() {
  $('.sidenav').sidenav();
  $('.parallax').parallax();

  const modal = document.querySelector('.modal');
  let instance = M.Modal.init(modal, {dismissible: false});
    
  const step1 = document.querySelector('#step1')
  const step2 = document.querySelector('#step2')
  const step3 = document.querySelector('#step3')
  const next = document.querySelector('#next')
  const prev = document.querySelector('#prev')
  const finalizaCompra = document.querySelector('#finalizaCompra')
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
  
  finalizaCompra.addEventListener('click', e => {
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
    let agregarArticulo = `<span class="column col s2 nombreCarrito">${art.nombre}</span>
                          <span class="column col s2 precioCarrito" data-precioUnitario="${art.precioUnitario}">$${art.precio}</span>
                          <span class="column col s2 cantidadCarrito">${art.cantidad}</span>
                          <span class="column col s2 restarArticulo estiloCarrito">-</span>
                          <span class="column col s2 sumarArticulo estiloCarrito">+</span>
                          <span class="column col s2 eliminarArticulo">Eliminar</span>`;
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