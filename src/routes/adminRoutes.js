import express from'express';
const router = express.Router();
import authMiddleware from'../middlewares/authMiddleware.js';
import userLoggedMiddleware from'../middlewares/userLoggedMiddleware.js';
import userValidatorMiddleware from'../middlewares/userValidatorMiddleware.js';
import adminController from '../controllers/adminController.js';
import marcaUploadImage from '../middlewares/marcaMulterMidleware.js'
import validacionMarca from '../middlewares/validacionMarcaMidleware.js'
import validacionAccesorio from '../middlewares/validacionAccesorioMidleware.js'
import validacionArticulo from '../middlewares/validacionArticuloMidleware.js'
import multer from 'multer';
const upload = multer();

router.get('/', userLoggedMiddleware, adminController.login);

router.post('/', userValidatorMiddleware, adminController.loginUser);

router.get('/dashboard', adminController.dashboard);

router.get('/logout', authMiddleware, adminController.logout);

router.post('/crearArticulo', upload.none(), validacionArticulo.crear(), adminController.createArticulo);

router.post('/actualizarArticulo', upload.none(), validacionArticulo.actualizar(), adminController.updateArticulo);

router.post('/eliminarArticulo', adminController.deleteArticulo);

router.post('/crearMarca', marcaUploadImage.single('archivo'), validacionMarca.crear(), adminController.createMarca);

router.post('/updateMarca', marcaUploadImage.single('archivo'), validacionMarca.actualizar(), adminController.updateMarca);

router.post('/eliminarMarca', adminController.deleteMarca);

router.post('/accesorios', adminController.getAccesorios);

router.post('/accesoriosArticulo', adminController.getAccesoriosArticulo);

router.post('/grabarAccesoriosArticulo', adminController.grabarAccesoriosArticulo);

router.post('/createAccesorio', upload.none(), validacionAccesorio.crear(), adminController.createAccesorio);

router.post('/updateAccesorio', upload.none(), validacionAccesorio.actualizar(), adminController.updateAccesorio);

router.post('/eliminarAccesorio', adminController.deleteAccesorio);

export default router