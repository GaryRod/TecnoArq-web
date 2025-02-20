import express  from "express";
const app = express();
import cors from "cors"
import path  from'path';
import { fileURLToPath } from 'url';
import session  from'express-session';
import cookieParser from'cookie-parser';

import mainRoutes  from './routes/mainRoutes.js';
import adminRoutes  from './routes/adminRoutes.js';
// import userLoggedMiddleware from './middlewares/userLoggedMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
// Sessiones y Cookies
app.use(session({
    secret: "No deberías estar leyendo esto!",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(cookieParser())

// User logged
// app.use(userLoggedMiddleware)

// Archivos estáticos
app.use(express.static('public'));

// // Requerimientos para templates
app.set('view engine', 'ejs')
app.set("views", path.resolve(__dirname, "./views"))

// // Requerimientos para formularios
import methodOverride from 'method-override'; 
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// // Rutas
app.use('/', mainRoutes)
app.use('/admin', adminRoutes)

// Error 404
app.use((req, res, next) => {
    res.status(404).render(path.resolve(__dirname,'views/notFound'))
})

const port = 3000

app.listen(process.env.PORT || port, () => { 
    console.log(`Servidor funcionando ${port}`)
});