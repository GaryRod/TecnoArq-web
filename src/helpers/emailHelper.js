import nodemailer from 'nodemailer'
import generarPDFConTablaAsync from './pdfHelper.js'

const emailHelper = async (body) => {
    const datosArticulos = body.carrito.map(art => ({articulo: art.title, cantidad: art.quantity, precio: art.unit_price, subtotal: art.unit_price * art.quantity}));

    const datosComprador = {
        nombre: body.nombre,
        apellido: body.apellido,
        numeroDocumento: body.numeroDocumento,
        email: body.email,
        provincia: body.provincia,
        localidad: body.localidad,
        calle: body.calle,
        numeroCalle: body.numeroCalle,
        numeroCelular: body.numeroCelular,
        codigoPostal: body.codigoPostal,
        datosAdicionales: body.datosAdicionales
    }

    const pdfBuffer = await new Promise((resolve, reject) => {
        generarPDFConTablaAsync(datosArticulos, datosComprador,(err, buffer) => {
            if (err) {
              reject(err);
            } else {
              resolve(buffer);
            }
        });
    });

    const userGmail = process.env.EMAIL;
    const passAppGmail = process.env.EMAIL_PASSWORD;
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: userGmail,
        pass: passAppGmail,
        },
    });

    let mailOptions = {
        from: userGmail,
        to: body.email,
        bcc: userGmail,
        subject: "Detalle compra",
        text: "Gracias por realizar su compra! le dejamos adjunto su comprobante",
        attachments: [
            {
                filename: 'comprobante.pdf',
                content: pdfBuffer,
            },
        ],
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        return info.response.includes("OK");
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export default emailHelper;