import express  from'express';
const router = express.Router();
import productController  from'../controllers/mainController.js';

router.get('/', productController.index);

router.post('/accesoriosArticulo', productController.accesoriosArticulo);

router.post('/comprar', productController.comprar);

router.post('/comprobar', productController.comprobar);

export default router;