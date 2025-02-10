import express from'express';
const router = express.Router();
import authMiddleware from'../middlewares/authMiddleware.js';
import userLoggedMiddleware from'../middlewares/userLoggedMiddleware.js';
import userValidatorMiddleware from'../middlewares/userValidatorMiddleware.js';
import adminController from'../controllers/adminController.js';

router.get('/', userLoggedMiddleware, adminController.login);

router.get('/dashboard', authMiddleware, adminController.dashboard);

router.post('/', userValidatorMiddleware, adminController.loginUser);

router.get('/logout', authMiddleware, adminController.logout);

router.post('/actualizarArticulo', adminController.updateArticulo);

router.post('/crearArticulo', adminController.createArticulo);

router.post('/eliminarArticulo', adminController.deleteArticulo);

router.post('/crearMarca', adminController.createMarca);

router.post('/updateMarca', adminController.updateMarca);

export default router