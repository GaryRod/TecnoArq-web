const authenticationMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/admin')
  } 
  next();
};

export default authenticationMiddleware;
