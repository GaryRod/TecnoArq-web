import express  from'express';
const router = express.Router();
// Solicito todas las funcionalidades del productController
import productController  from'../controllers/mainController.js';

// /* Con readAll - LISTADO DE PRODUCTOS, RENDERIZA CATALOGO DE PRODUCTOS*/
router.get('/', productController.index);

router.post('/comprar', productController.comprar);
// // router.get('/support', productController.support);

export default router;