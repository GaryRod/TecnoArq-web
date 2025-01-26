import express  from'express';
const router = express.Router();
// Solicito todas las funcionalidades del productController
import productController  from'../controllers/mainController.js';
import PDFDocument from "pdfkit-table"
// /* Con readAll - LISTADO DE PRODUCTOS, RENDERIZA CATALOGO DE PRODUCTOS*/
router.get('/', productController.index);

router.post('/comprar', productController.comprar);

router.get('/ver-pdf', (req, res) => {
    const doc = new PDFDocument({size: [600,400],  margins: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      }
    });
    const datosCompra = {
        nombre: "Juan Pérez",
        dni: "12345678",
        calle: "Av. Siempre Viva",
        numeroCalle: "742",
        localidad: "Springfield",
        provincia: "Buenos Aires",
        telefono: "123-456-7890",
        email: "juan.perez@example.com",
      };
      
    doc.fontSize(14).font("Helvetica-Bold").text("Datos de Compra", { align:  "left" });
      
    doc.fontSize(9).font("Helvetica");
      
    doc.text(`Nombre: ${datosCompra.nombre}`, { lineGap: 6 });
    doc.text(`DNI: ${datosCompra.dni}`, { lineGap: 6 });
    doc.text(`Calle: ${datosCompra.calle} ${datosCompra.numeroCalle}`, { lineGap: 6 });
    doc.text(`Localidad: ${datosCompra.localidad}`, { lineGap: 6 });
    doc.text(`Provincia: ${datosCompra.provincia}`, { lineGap: 6 });
    doc.text(`Teléfono: ${datosCompra.telefono}`, { lineGap: 6 });
    doc.text(`Email: ${datosCompra.email}`, { lineGap: 20 });
      
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="documento.pdf"');
  
    doc.image('./public/images/Fision-tech.png', 540, 5, {scale: 0.20})

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
        datas: [
            { 
                articulo: 'Name 1', 
                cantidad: '1', 
                precio: '1', 
                subtotal: '3'
            },
            { 
                articulo: 'Name 2', 
                cantidad: '2', 
                precio: '2', 
                subtotal: '4'
            }
        ],
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
  
    doc.pipe(res);
    doc.end();
  });
  

export default router;