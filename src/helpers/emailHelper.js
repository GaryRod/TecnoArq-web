import nodemailer from 'nodemailer'
import generarPDFConTablaAsync from './pdfHelper.js'

const emailHelper = async (body) => {
    const datosArticulos = body.carrito.map(art => ({articulo: art.nombre, cantidad: art.cantidad, precio: art.precio.replace(".","").replace(",","."), subtotal: art.precio.replace(".","").replace(",",".")*art.cantidad}));

    const datosComprador = {
        nombre: body.nombre,
        apellido: body.apellido,
        numeroDocumento: body.numeroDocumento,
        email: body.email,
        provincia: body.provincia,
        localidad: body.localidad,
        calle: body.calle,
        numeroCalle: body.numeroCalle,
        numeroCelular: body.numeroCelular
    }
    
    const pdfBuffer = await new Promise((resolve, reject) => {
        generarPDFConTablaAsync(datosArticulos, datosComprador,(err, buffer) => {
            if (err) {
              reject(err); // Rechazar la promesa si ocurre un error
            } else {
              resolve(buffer); // Resolver la promesa con el buffer del PDF
            }
        });
    });

    const userGmail = "hablameaqui360@gmail.com";
    const passAppGmail = "mcol zuqu bfkn yaad";
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
                content: pdfBuffer, // Usar el buffer generado del PDF
            },
        ],
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info.response.includes("OK");
            
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export default emailHelper;