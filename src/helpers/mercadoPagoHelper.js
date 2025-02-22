import mercadoPago from 'mercadopago';
const {MercadoPagoConfig , Preference} = mercadoPago;
import dotenv from 'dotenv';
import dbPedidos from'../models/pedidosModel.js';
import dbArticulosPedidos from'../models/articulosPedidosModel.js';
import dbCompradores from'../models/compradorModel.js';
import emailHelper from'./emailHelper.js';
import executeTransaction from'./transactionHelper.js';

const crearOrden = async (body) => {
  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const items = body.carrito.map(art => ({id: art.codigo, title: art.nombre, quantity: art.cantidad, unit_price: Number(art.precio.replace(".","").replace(",","."))}));
    const itemsUSD = body.carrito.map(art => ({id: art.codigo, precioUSD: Number(art.preciousd.replace(".","").replace(",","."))}) )
    const preference = await new Preference(client).create({
        body: {
          items: items,
          shipments: {
            receiver_address: {
              apartment: body.provincia,
              city_name: body.localidad,
              street_name: body.calle,
              street_number: body.numeroCalle,
              zip_code: body.codigoPostal,
              floor: body.datosAdicionales
            }
          },
          payer: {
            name: body.nombre,
            surname: body.apellido,
            email: body.email,
            identification: {
              type: "DNI",
              number: body.numeroDocumento
            },
            phone:{
              area_code: 54,
              number: body.numeroCelular
            }
          },
          back_urls: {
            success: "https://www.thefisiontech.com/",
            failure: "https://www.thefisiontech.com/",
            pending: "https://www.thefisiontech.com/"
          },
          auto_return: "approved",
          notification_url: "https://www.thefisiontech.com//comprobar",
          metadata: {
            email: body.email,
            itemsUSD: itemsUSD
          }
        },
      })
    return preference.init_point;
}

const validarPago = async (req, res) => {
  try {
    
    let data = req.query
    if (data.type === "payment") {
      const CODIGO_MP = data["data.id"];
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${CODIGO_MP}`, {
        headers: {
          "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      })
      let codigoPedido;
      await executeTransaction(async (connection) => {
        codigoPedido = await dbPedidos.getByCodigoMP(connection, CODIGO_MP);
      })
      if (response.ok) {
        if(codigoPedido){
          return res.sendStatus(204)
        }
        const data = await response.json();
        const payer = data.payer;
        const payerAditional = data.additional_info.payer;
        const addresss = data.additional_info.shipments.receiver_address;
        const itemsUSD = data.metadata.items_usd;
        let body = {
          nombre: payerAditional.first_name,
          apellido: payerAditional.last_name,
          email: data.metadata.email,
          codigoPostal: addresss.zip_code,
          datosAdicionales: addresss.floor ? addresss.floor : null,
          numeroCelular: Number(payerAditional.phone.number.replaceAll(" ", "")),
          numeroDocumento: Number(payer.identification.number),
          localidad: addresss.city_name,
          provincia: addresss.apartment,
          calle: addresss.street_name,
          numeroCalle: Number(addresss.street_number),
          carrito: data.additional_info.items
        }
        let responseMail = await emailHelper(body);
        let mensajeError;
        if (!responseMail) {
            mensajeError = "Lo sentimos surgio un error inesperado al enviar el mail con el comprobante, contactese con el administrador."
        }else{
          await executeTransaction(async (connection) => {
              const totalPrecio = body.carrito.reduce((total, art) => total + art.unit_price * art.quantity, 0);
              body.carrito.forEach(art => {
                art.precioUSD = itemsUSD.find(artUSD => artUSD.id === art.id).precio_usd;
              });
              const totalPrecioUSD = body.carrito.reduce((total, art) => total + art.precioUSD * art.quantity, 0);
              const numeroComprador = await dbCompradores.maxID(connection);
              await dbCompradores.insert(connection, numeroComprador, body.nombre, body.apellido, body.numeroDocumento, body.email, body.calle,body.numeroCalle, body.localidad, body.provincia, body.numeroCelular, body.codigoPostal, body.datosAdicionales);
              const numeroPedido = await dbPedidos.maxID(connection);
              await dbPedidos.insert(connection, numeroPedido, numeroComprador, CODIGO_MP, totalPrecio, totalPrecioUSD);
              for (const articulo of body.carrito) {
                  const precioUSD = itemsUSD.find(artUSD => artUSD.id === articulo.id).precio_usd;
                  await dbArticulosPedidos.insert(connection, numeroPedido, articulo.id, articulo.quantity, articulo.unit_price, precioUSD);
              }
            })
            return res.sendStatus(204)
        }
       return res.sendStatus(400)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export default {validarPago, crearOrden};
