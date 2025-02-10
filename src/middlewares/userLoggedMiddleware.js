async function userLoggedMiddleware(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect("/admin/dashboard")
    }
    next()
}

export default userLoggedMiddleware;
