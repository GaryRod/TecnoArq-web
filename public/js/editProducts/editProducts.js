document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.collapsible.expandable');
  const instances = M.Collapsible.init(elems, {
    accordion: false,
    onOpenStart: function(el) {
      const arrow = el.querySelector('.arrow-icon');
      if (arrow) arrow.classList.add('rotate');
    },
    onCloseStart: function(el) {
      const arrow = el.querySelector('.arrow-icon');
      if (arrow) arrow.classList.remove('rotate');
    }
  });

  document.querySelectorAll('.precio').forEach(input => {
    new Cleave(input, {
      numeral: true,
       numeralDecimalMark: ',',
      delimiter: '.',
      numeralPositiveOnly: true,
      numeralIntegerScale: 12,
      prefix: '$'
    });
  });

  document.querySelectorAll('.precioUSD').forEach(input => {
    new Cleave(input, {
      numeral: true,
      numeralDecimalMark: ',',
      delimiter: '.',
      numeralPositiveOnly: true,
      numeralIntegerScale: 12,
      prefix: 'USD'
    });
  });
});


document.querySelector(".collapsible.expandable").addEventListener("click", function (event) {
  const header = event.target.closest('.collapsible-header');
  const editBtn = event.target.closest('.edit-btn');
  const checkEdit = event.target.closest('.check-edit');
  const nombreMarca = event.target.closest('.nombreMarca');
  const updateBtn = event.target.closest('.update-btn');
  const saveBtn = event.target.closest('.save-btn');
  const sinGuardar = event.target.closest('.sinGuardar');
  
  if (editBtn || checkEdit || nombreMarca || saveBtn || sinGuardar || updateBtn)
    event.stopImmediatePropagation();
  if (editBtn) {
    header.querySelector(".arrow-icon").style.display = "none";
    header.querySelector(".nombreMarcaOriginal").style.display = "none";
    header.querySelector(".update-btn").style.display = "block";
    header.querySelector(".edit-container").style.display = "flex";
    editBtn.style.display = "none";
  }
  if (updateBtn)
    actualizarMarca(event);
  if (saveBtn)
    grabarMarca(event);
});


document.querySelector("#crearMarca").addEventListener('click', e => {
  const containerCollapsible = document.querySelector(".expandable");
  const li = document.createElement("li")
  const newHeader = `<div class="collapsible-header sinGuardar" data-codigoMarca="">
                      <!-- Botón de editar -->
                      <button class="btn btn-small edit-btn" style="display: none;">
                        <i class="material-icons">edit</i>
                      </button>
                      <!-- Contenedor de edición (se oculta inicialmente) -->
                      <div class="edit-container row" style="display: flex; align-items: center; gap: 10px;">
                        <label class="check-edit">
                          <input type="checkbox" class="utilizable" checked/>
                          <span></span>
                        </label>
                         <div class="">
                          <input type="text" class="codigoMarca" placeholder="Código" maxlength="5">
                          <div class="mensaje-error red-text text-accent-4"></div>
                        </div>
                        <div class="">
                          <input type="text" class="nombreMarca" placeholder="Nombre" maxlength="100">
                          <div class="mensaje-error red-text text-accent-4"></div>
                        </div>
                        <!-- Boton grabar -->
                        <button class="btn btn-small save-btn">
                          <i class="material-icons">check</i>
                        </button>
                      </div>
                      <!-- Texto del nombre (se oculta al editar) -->
                      <span class="nombreMarcaOriginal" style="display: none;"></span>
                      <i class="material-icons arrow-icon" style="display: none;">expand_more</i>
                    </div>
                    <!-- Contenido colapsable -->
                    </div>
                    <div class="collapsible-body containerMarca" data-codigoMarca="">
                      <ul>
                        <li class="row valign-wrapper contArticuloActualizar">
                        </li>
                      </ul>
                      <div class="col s2">
                        <button class="btn nuevoArticulo">Nuevo articulo</button>
                      </div>
                    </div>`
  li.innerHTML = newHeader;
  containerCollapsible.appendChild(li);
})

document.querySelector("#containerProducts").addEventListener('click', e => {
  if (e.target.classList.contains('nuevoArticulo')) {
    const containerMarca = e.target.closest(".containerMarca");
    const div = document.createElement("div");
    div.classList.add("valign-wrapper")
    div.classList.add("row")
    div.classList.add("contArticuloNuevo")
    const agregarArticulo = `<div class="col s12">
                              <div class="row">
                                <!-- Ícono (solo en pantallas grandes) -->
                                <div class="col m1 center-align hide-on-small-only"  style="margin-top: 10px;">
                                  <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
                                </div>
                                <!-- Checkbox -->
                                <div class="col s12 m1"  style="margin-top: 10px;">
                                  <label>
                                    <input class="utilizable" type="checkbox" checked/>
                                    <span></span>
                                  </label>
                                </div>
                                 <!-- Input: Codigo -->
                                <div class="col s12 m2">
                                  <input type="text" class="codigoArticulo" placeholder="Código" maxlength="10"/>
                                  <div class="mensaje-error red-text text-accent-4"></div>
                                </div>
                                <!-- Input: Nombre -->
                                <div class="col s12 m4">
                                  <input type="text" class="nombreArticulo" placeholder="Nombre" maxlength="300"/>
                                  <div class="mensaje-error red-text text-accent-4"></div>
                                </div>
                                <!-- Input: Precio -->
                                <div class="col s12 m2">
                                  <input type="text" class="precio" placeholder="Precio"/>
                                  <div class="mensaje-error red-text text-accent-4"></div>
                                </div>
                                <!-- Input: Precio USD -->
                                <div class="col s12 m2">
                                  <input type="text" class="precioUSD" placeholder="Precio USD"/>
                                  <div class="mensaje-error red-text text-accent-4"></div>
                                </div>
                              </div>
                            </div>
                          
                            <!-- Bloque de Botones -->
                            <div class="col s2">
                              <div class="row">
                                <div class="col s2 m1 center-align marginButtonSave">
                                  <button class="btn-floating btn-small">
                                    <i class="material-icons grabarArticulo">save</i>
                                  </button>
                                </div>
                              </div>
                            </div>`
    div.innerHTML = agregarArticulo;
    containerMarca.appendChild(div);
    const precioUSD = div.querySelector(".precioUSD");
    const precio = div.querySelector(".precio");

    new Cleave(precioUSD, {
      numeral: true,
      numeralDecimalMark: ',',
      delimiter: '.',
      numeralPositiveOnly: true,
      numeralIntegerScale: 12,
      prefix: 'USD'
    });

    new Cleave(precio, {
      numeral: true,
      numeralDecimalMark: ',',
      delimiter: '.',
      numeralPositiveOnly: true,
      numeralIntegerScale: 12,
      prefix: '$'
    });
  }
})

document.querySelectorAll(".containerMarca").forEach(element => {
  element.addEventListener('click', e => {
    if (e.target.classList.contains("actualizarArticulo")) {
      actualizarArticulo(e);
    } else if (e.target.classList.contains("grabarArticulo")) {
      grabarArticulo(e, element);
    } else if (e.target.classList.contains("eliminarArticulo")) {
      eliminarArticulo(e);
    }
  })
})

function actualizarMarca(e) {
  let header = e.target.closest(".collapsible-header");
  const marca = header.querySelector(".nombreMarca")
  const utilizable = header.querySelector(".utilizable")
  const datosFormulario = {
    codigo: header.getAttribute("data-codigoMarca"),
    marca: marca.value,
    utilizable: utilizable.checked
  }
  let hayError = validarMarcaActualizar(marca);
  if (!hayError) {
    fetch('/admin/updateMarca', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosFormulario)
    })
    .then(response => response.text())
    .then(data => {
      data = JSON.parse(data)
      if (!data.hayError) {
        header.querySelector(".arrow-icon").style.display = "block";
        let marcaNombre = header.querySelector(".nombreMarcaOriginal")
        marcaNombre.style.display = "block";
        marcaNombre.innerText = marca.value;
        header.querySelector(".edit-container").style.display = "none";
        header.querySelector(".edit-btn").style.display = "block";
        e.target.closest('.update-btn').style.display = "none";
        M.toast({
          html: 'Actualización existosa',
          classes: 'rounded green lighten-1',
          displayLength: 2000
        });
      } else {
        M.toast({
          html: data.mensaje,
          classes: 'rounded red lighten-1',
          displayLength: 2000
        });
      }
    })
    .catch(error => {
      M.toast({
        html: `Ocurrio un error al actualizar, ${error}`,
        classes: 'rounded red lighten-1',
        displayLength: 2000
      });
    });
  }
}

function grabarMarca(e) {
  let header = e.target.closest(".collapsible-header");
  const marca = header.querySelector(".nombreMarca")
  const marcaCodigo = header.querySelector(".codigoMarca")
  const utilizable = header.querySelector(".utilizable")
  const datosFormulario = {
    codigo: marcaCodigo.value,
    marca: marca.value,
    utilizable: utilizable.checked
  }
  let hayError = validarMarcaNuevo(marca, marcaCodigo);
  if (!hayError) {
    fetch('/admin/crearMarca', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosFormulario)
    })
    .then(response => response.text())
    .then(data => {
      data = JSON.parse(data)
      if (!data.hayError) {
        header.querySelector(".arrow-icon").style.display = "block";
        let marcaNombre = header.querySelector(".nombreMarcaOriginal")
        marcaNombre.style.display = "block";
        marcaNombre.innerText = marca.value;
        header.querySelector(".edit-container").style.display = "none";
        header.querySelector(".edit-btn").style.display = "block";
        const saveBtn = header.querySelector('.save-btn');
        saveBtn.style.display = "none";
        saveBtn.classList.remove("save-btn");
        saveBtn.classList.add("update-btn");
        header.classList.remove("sinGuardar");
        marcaCodigo.remove();
        M.toast({
          html: 'Grabación existosa',
          classes: 'rounded green lighten-1',
          displayLength: 2000
        });
      } else {
        M.toast({
          html: data.mensaje,
          classes: 'rounded red lighten-1',
          displayLength: 2000
        });
      }
    })
    .catch(error => {
      M.toast({
        html: `Ocurrio un error al actualizar, ${error}`,
        classes: 'rounded red lighten-1',
        displayLength: 2000
      });
    });
  }
}

function actualizarArticulo(e) {
  const contArticuloActualizar = e.target.closest(".contArticuloActualizar");
  const articulo = contArticuloActualizar.querySelector(".nombreArticulo")
  const precio = contArticuloActualizar.querySelector(".precio")
  const precioUSD = contArticuloActualizar.querySelector(".precioUSD")
  const utilizable = contArticuloActualizar.querySelector(".utilizable")
  const datosFormulario = {
    codigo: articulo.getAttribute("data-codigo"),
    articulo: articulo.value,
    precio: precio.value.slice(1),
    precioUSD: precioUSD.value.slice(3),
    utilizable: utilizable.checked
  }
  let hayError = validarArticuloActualizar(articulo, precio, precioUSD);
  if (!hayError) {
    fetch('/admin/actualizarArticulo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosFormulario)
    })
    .then(response => response.text())
    .then(data => {
      data = JSON.parse(data)
      if (!data.hayError) {
        M.toast({
          html: 'Actualización existosa',
          classes: 'rounded green lighten-1',
          displayLength: 2000
        });
      } else {
        M.toast({
          html: data.mensaje,
          classes: 'rounded red lighten-1',
          displayLength: 2000
        });
      }
    })
    .catch(error => {
      M.toast({
        html: `Ocurrio un error al actualizar, ${error}`,
        classes: 'rounded red lighten-1',
        displayLength: 2000
      });
    });
  }
}

function grabarArticulo(e, element) {
  const codigoMarca = element.getAttribute("data-codigoMarca")
  const contArticuloNuevo = e.target.closest(".contArticuloNuevo");
  const codigoArticulo = contArticuloNuevo.querySelector(".codigoArticulo")
  const articulo = contArticuloNuevo.querySelector(".nombreArticulo")
  const precio = contArticuloNuevo.querySelector(".precio")
  const precioUSD = contArticuloNuevo.querySelector(".precioUSD")
  const utilizable = contArticuloNuevo.querySelector(".utilizable")
  const datosFormulario = {
    codigoMarca: codigoMarca,
    codigo: codigoArticulo.value,
    articulo: articulo.value,
    precio: precio.value.slice(1),
    precioUSD: precioUSD.value.slice(3),
    utilizable: utilizable.checked
  }
  let hayError = validarArticuloNuevo(codigoArticulo, articulo, precio, precioUSD);
  if (!hayError) {
    fetch('/admin/crearArticulo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosFormulario)
    })
    .then(response => response.text())
    .then(data => {
      data = JSON.parse(data)
      if (!data.hayError) {
        contArticuloNuevo.remove();
        const li = document.createElement("li");
        li.classList.add("row")
        li.classList.add("valign-wrapper")
        li.classList.add("contArticuloActualizar")
        const articulosActuales = element.firstElementChild;
        const articuloGrabado = `<div class="col s12">
                                    <div class="row">
                                      <!-- Ícono (solo en pantallas grandes) -->
                                      <div class="col m1 center-align hide-on-small-only"  style="margin-top: 10px;">
                                        <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
                                      </div>
                                      <!-- Checkbox -->
                                      <div class="col s12 m1"  style="margin-top: 10px;">
                                        <label>
                                          <input class="utilizable" type="checkbox" checked/>
                                          <span></span>
                                        </label>
                                      </div>
                                      <!-- Input: Nombre -->
                                      <div class="col s12 m6">
                                        <input type="text" class="nombreArticulo" data-codigo="${codigoArticulo.value}" value="${articulo.value}" placeholder="Nombre" maxlength="300"/>
                                        <div class="mensaje-error red-text text-accent-4"></div>
                                      </div>
                                      <!-- Input: Precio -->
                                      <div class="col s12 m2">
                                        <input type="text" class="precio" value="${precio.value.slice(1)}" placeholder="Precio"/>
                                        <div class="mensaje-error red-text text-accent-4"></div>
                                      </div>
                                      <!-- Input: Precio USD -->
                                      <div class="col s12 m2">
                                        <input type="text" class="precioUSD" value="${precioUSD.value.slice(3)}" placeholder="Precio USD"/>
                                        <div class="mensaje-error red-text text-accent-4"></div>
                                      </div>
                                    </div>
                                  </div>
                                
                                  <!-- Bloque de Botones -->
                                  <div class="col s2">
                                    <div class="row">
                                      <div class="col s12 m1 center-align marginButtonSave">
                                        <button class="btn-floating btn-small">
                                          <i class="material-icons actualizarArticulo">save</i>
                                        </button>
                                      </div>
                                      <div class="col s12 m1 center-align marginButtonDelete">
                                        <button class="btn-floating btn-small red accent-4">
                                          <i class="material-icons eliminarArticulo">delete</i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>`
        li.innerHTML = articuloGrabado;
        articulosActuales.appendChild(li);
        const precioUSDNuevo = li.querySelector(".precioUSD");
        const precioNuevo = li.querySelector(".precio");
    
        new Cleave(precioUSDNuevo, {
          numeral: true,
          numeralDecimalMark: ',',
          delimiter: '.',
          numeralPositiveOnly: true,
          numeralIntegerScale: 12,
          prefix: 'USD'
        });
    
        new Cleave(precioNuevo, {
          numeral: true,
          numeralDecimalMark: ',',
          delimiter: '.',
          numeralPositiveOnly: true,
          numeralIntegerScale: 12,
          prefix: '$'
        });                        
        M.toast({
          html: 'Grabacion existosa',
          classes: 'rounded green lighten-1',
          displayLength: 2000
        });
      } else {
        M.toast({
          html: data.mensaje,
          classes: 'rounded red lighten-1',
          displayLength: 2000
        });
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
}


function eliminarArticulo(e) {
  const contArticuloActualizar = e.target.closest(".contArticuloActualizar");
  const articulo = contArticuloActualizar.querySelector(".nombreArticulo")
  const datosFormulario = {
    codigo: articulo.getAttribute("data-codigo"),
  }
  fetch('/admin/eliminarArticulo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosFormulario)
  })
  .then(response => response.text())
  .then(data => {
    data = JSON.parse(data)
    if (!data.hayError) {
      contArticuloActualizar.remove();
      M.toast({
        html: 'Eliminación existosa',
        classes: 'rounded green lighten-1',
        displayLength: 2000
      });
    } else {
      M.toast({
        html: data.mensaje,
        classes: 'rounded red lighten-1',
        displayLength: 2000
      });
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

function validarMarcaActualizar(marca) {
  let hayErrorNombre = validarNombreArticulo(marca);
  return hayErrorNombre;
}

function validarMarcaNuevo(marca, codigo) {
  let hayErrorNombre = validarNombreArticulo(marca);
  let hayErrorCodigo = validarNombreArticulo(codigo);
return hayErrorNombre || hayErrorCodigo;
}

function validarArticuloNuevo(codigoArticulo, articulo, precio, precioUSD) {
  let hayErrorNombre = validarNombreArticulo(articulo);
  let hayErrorCodigo = validarCodigo(codigoArticulo);
  let hayErrorPrecio = validarPrecio(precio);
  let hayErrorPrecioUSD = validarPrecio(precioUSD);
  return hayErrorNombre || hayErrorPrecio || hayErrorPrecioUSD || hayErrorCodigo;
}

function validarArticuloActualizar(articulo, precio, precioUSD) {
  let hayErrorNombre = validarNombreArticulo(articulo);
  let hayErrorPrecio = validarPrecio(precio);
  let hayErrorPrecioUSD = validarPrecio(precioUSD);
  return hayErrorNombre || hayErrorPrecio || hayErrorPrecioUSD;
}


function validarCodigo(codigo) {
  let valor = codigo.value;
  let hayError = false;
  if (validarCampoVacio(valor)) {
    mostrarTooltip(codigo, "Completar");
    hayError = true;
  }
  else{
    ocultarTooltip(codigo);
    hayError = false;
  }
  return hayError;
}


function validarNombreArticulo(articulo) {
  let valor = articulo.value;
  let hayError = false;
  if (validarCampoVacio(valor)) {
    mostrarTooltip(articulo, "Completar");
    hayError = true;
  }
  else{
    ocultarTooltip(articulo);
    hayError = false;
  }
  return hayError;
}

function validarPrecio(precio) {
  let valor = precio.value.replace(/\D+/g, "");
  let hayError = false;
  if (validarCampoVacio(valor)) {
    mostrarTooltip(precio, "Completar");
    hayError = true;
  }
  else if (validarMayorCero(valor)) {
    mostrarTooltip(precio, "Debe ser mayor a 0");
    hayError = true;
  }
  else{
    ocultarTooltip(precio);
    hayError = false;
  }
  return hayError;
}

function validarCampoVacio(valor) {
  valor = valor.trim();
  return valor === "";
}

function validarMayorCero(valor) {
  return Number(valor) === 0;
}

function mostrarTooltip(input, mensaje) {
  let contenedorError = input.parentNode.querySelector(".mensaje-error");
  input.classList.add("invalid");
  contenedorError.innerText = mensaje;
  contenedorError.style.opacity = "1";
}

function ocultarTooltip(input) {
  let contenedorError = input.parentNode.querySelector(".mensaje-error");
  input.classList.remove("invalid");
  contenedorError.style.opacity = "0";
}