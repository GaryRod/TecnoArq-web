import express  from'express';
const router = express.Router();
import productController  from'../controllers/mainController.js';

router.get('/', productController.index);

router.post('/comprar', productController.comprar);

router.post('/comprobar', productController.comprobar);

router.get('/comprobar', productController.comprobarGet);

export default router;