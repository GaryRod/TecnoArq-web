import express from'express';
const router = express.Router();
import authMiddleware from'../middlewares/authMiddleware.js';
import userLoggedMiddleware from'../middlewares/userLoggedMiddleware.js';
import userValidatorMiddleware from'../middlewares/userValidatorMiddleware.js';
import adminController from'../controllers/adminController.js';

router.get('/', userLoggedMiddleware, adminController.login);

router.post('/', userValidatorMiddleware, adminController.loginUser);

router.get('/dashboard', authMiddleware, adminController.dashboard);

router.get('/logout', authMiddleware, adminController.logout);

router.post('/actualizarArticulo', adminController.updateArticulo);

router.post('/crearArticulo', adminController.createArticulo);

router.post('/eliminarArticulo', adminController.deleteArticulo);

router.post('/crearMarca', adminController.createMarca);

router.post('/updateMarca', adminController.updateMarca);

router.post('/eliminarMarca', adminController.deleteMarca);

router.post('/accesoriosArticulo', adminController.getAccesoriosArticulo);

router.post('/grabarAccesoriosArticulo', adminController.grabarAccesoriosArticulo);

router.post('/accesorios', adminController.getAccesorios);

router.post('/updateAccesorio', adminController.updateAccesorio);

router.post('/eliminarAccesorio', adminController.deleteAccesorio);

router.post('/createAccesorio', adminController.createAccesorio);

export default router