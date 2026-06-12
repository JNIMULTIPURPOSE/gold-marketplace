const express = require("express");
const router = express.Router();
const db = require("../firebase");
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth");

// ====================
// LIST ALL PRODUCTS
// ====================
router.get("/", adminAuth, async (req, res) => {
    try {
        const snapshot = await db.collection("products").get();

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render("admin/products", { products });

    } catch (error) {
        console.log(error);
        res.send("Error loading products");
    }
});

// ====================
// NEW PRODUCT FORM
// ====================
router.get("/new", adminAuth, (req, res) => {
    res.render("admin/new-product");
});

// ====================
// SAVE PRODUCT
// ====================
router.post("/new", adminAuth, upload.single("image"), async (req, res) => {

    try {

        const { title, price, description } = req.body;

        await db.collection("products").add({
            title,
            price,
            description,
            image: req.file ? req.file.path : "",
            createdAt: new Date()
        });

        res.redirect("/products");

    } catch (error) {

        console.log(error);
        res.send("Error saving product");

    }
});

// ====================
// EDIT FORM
// ====================
router.get("/edit/:id", adminAuth, async (req, res) => {

    const doc = await db.collection("products")
        .doc(req.params.id)
        .get();

    if (!doc.exists) {
        return res.send("Product not found");
    }

    res.render("admin/edit-product", {
        product: {
            id: doc.id,
            ...doc.data()
        }
    });

});

// ====================
// UPDATE PRODUCT
// ====================
router.post("/edit/:id", adminAuth, async (req, res) => {

    const { title, price, description } = req.body;

    await db.collection("products")
        .doc(req.params.id)
        .update({
            title,
            price,
            description
        });

    res.redirect("/products");

});

// ====================
// DELETE PRODUCT
// ====================
router.get("/delete/:id", adminAuth, async (req, res) => {

    await db.collection("products")
        .doc(req.params.id)
        .delete();

    res.redirect("/products");

});

// ====================
// SINGLE PRODUCT PAGE
// ====================
router.get("/view/:id", async (req, res) => {

    try {

        const doc = await db
            .collection("products")
            .doc(req.params.id)
            .get();

        if (!doc.exists) {
            return res.send("Product not found");
        }

        res.render("product", {
            product: {
                id: doc.id,
                ...doc.data()
            }
        });

    } catch (error) {

        console.log(error);
        res.send("Error loading product");

    }

});

module.exports = router;