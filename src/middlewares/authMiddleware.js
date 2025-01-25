const authenticationMiddleware = (req, res, next) => {

  if (req.session.user) {
    next()
  }
  const auth = req.headers['authorization'];

  // Si no se proporciona el encabezado de autenticación, respondemos con 401 y pedimos las credenciales
  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Acceso restringido"');
    return res.status(401).send('ingrese sus datos');
  }

  // Extraemos el nombre de usuario y la contraseña de la cabecera Authorization
  const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');

  if (username == 'admin' && password.toString() == 1234) {
    req.session.user = username;
    // req.user.password = password;
  } else {
    return res.status(401).render('./error');
  }
  // const user = usersDB.find(user => user.username === username && user.password === password);

  // Si las credenciales no son correctas, respondemos con 403
  // if (!user) {
  //   return res.status(403).send('Credenciales incorrectas');
  // }

  // Guardamos el usuario autenticado en la solicitud
  // req.user = user;  
  next();
};

export default authenticationMiddleware;
