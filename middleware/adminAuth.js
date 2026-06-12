module.exports = function (req, res, next) {

    // check if admin is logged in
    if (req.session && req.session.admin) {
        return next(); // allow access
    }

    // block access and send to login
    return res.redirect("/admin/login");
};