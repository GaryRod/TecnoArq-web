import PDFDocument from "pdfkit-table"

/**
 * Función para generar un PDF con tablas usando async/await y callback.
 * @param {Object} data - Datos para la tabla.
 * @param {Function} callback - Callback para manejar el resultado o el error.
 */
const generarPDFConTablaAsync = async (dataArticulos, datosComprador, callback) => {
    try {
        const doc = new PDFDocument({size: [600,400],  margins: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            }
        });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            callback(null, pdfBuffer); // Llamar al callback con el resultado
        });
        doc.on('error', (err) => callback(err)); // Llamar al callback en caso de error
        
        doc.image('./public/images/Fision-tech.png', 540, 5, {scale: 0.20})
        doc.fontSize(14).font("Helvetica-Bold").text("Datos de Compra", { align:  "left" });
      
        doc.fontSize(9).font("Helvetica");
          
        doc.text(`Nombre: ${datosComprador.nombre}`, { lineGap: 6 });
        doc.text(`Apellido: ${datosComprador.apellido}`, { lineGap: 6 });
        doc.text(`DNI: ${datosComprador.numeroDocumento}`, { lineGap: 6 });
        doc.text(`Email: ${datosComprador.email}`, { lineGap: 6 });
        doc.text(`Provincia: ${datosComprador.provincia}`, { lineGap: 6 });
        doc.text(`Localidad: ${datosComprador.localidad}`, { lineGap: 6 });
        doc.text(`Calle: ${datosComprador.calle}`, { lineGap: 6 });
        doc.text(`Número calle: ${datosComprador.numeroCalle}`, { lineGap: 6 });
        doc.text(`Número celular: ${datosComprador.numeroCelular}`, { lineGap: 20 });
        
        doc.fontSize(14).font("Helvetica-Bold").text("Detalle compra", { align: "left" });
        const table = {
            headers: [
                { label: "Articulo", property: 'articulo', width: 290, renderer: null },
                { label: "Cantidad", property: 'cantidad', width: 90, renderer: null }, 
                { label: "Precio", property: 'precio', width: 100, 
                    renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {   return `$ ${Number(value).toFixed(2)}` } 
                },
                { label: "Subtotal", property: 'subtotal', width: 100, 
                    renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {   return `$ ${Number(value).toFixed(2)}` } 
                },
            ],
            datas: dataArticulos
        };

        const total = table.datas.reduce((sum, row) => sum + Number(row.subtotal), 0);

        const footerTable = {
            headers: [
                    { label: "Total", property: 'total', width: 480 }, 
                    { 
                        label: "", property: "finalTotal", width: 100,
                        renderer: (value) => `$ ${Number(value).toFixed(2)}`
                    }
                ],
            datas: [
                {
                    total: 'Total',
                    finalTotal: total
                }
            ],
        };
        
        doc.table(table);
        doc.table(footerTable);
        await new Promise((resolve) => doc.end(resolve));
    } catch (error) {
        callback(error);
    }
};

export default generarPDFConTablaAsync;
