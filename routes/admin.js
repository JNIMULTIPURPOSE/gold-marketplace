console.log("ADMIN ROUTES LOADED");
const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

// simple hardcoded admin for now (we improve later)
const ADMIN = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
};

// =======================
// LOGIN PAGE
// =======================
router.get("/login", (req, res) => {
    res.render("admin/login");
});

// =======================
// LOGIN ACTION
// =======================
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN.email && password === ADMIN.password) {
        req.session.admin = true;
        return res.redirect("/admin/dashboard");
    }

    res.send("Invalid login");
});

// =======================
// ADMIN MIDDLEWARE (PROTECTION)
// =======================
function isAdmin(req, res, next) {
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    next();
}

// =======================
// DASHBOARD
// =======================
router.get("/dashboard", adminAuth, (req, res) => {
    res.render("admin/dashboard");
});

// =======================
// OPTIONAL: ROOT ADMIN ROUTE
// (so /admin doesn't break)
// =======================
router.get("/", (req, res) => {
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    return res.redirect("/admin/dashboard");
});

// =======================
// LOGOUT
// =======================
router.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/admin/login");
    });

});

module.exports = router;