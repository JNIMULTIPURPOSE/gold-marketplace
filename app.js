require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

const db = require("./firebase");

// ========================
// BODY PARSERS
// ========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ========================
// SESSION
// ========================
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));// ========================
app.use(express.static("public"));

// ========================
// VIEW ENGINE
// ========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ========================
// ROUTES
// ========================
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");

app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
const blogRoutes = require("./routes/blog");
app.use("/blog", blogRoutes);

// ========================
// HOME PAGE (PUBLIC)
// ========================
app.get("/", async (req, res) => {

```
try {

    const productsSnapshot = await db.collection("products").get();

    const blogSnapshot = await db.collection("blog").get();

    const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const posts = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    res.render("index", {
        products,
        posts
    });

} catch (error) {

    console.error(error);

    res.render("index", {
        products: [],
        posts: []
    });

}
```

});



// ========================
// STATIC FILES


app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});
// ========================
// SHOP PAGE (PUBLIC STORE)
// ========================
app.get("/shop", async (req, res) => {

    try {

        const snapshot = await db.collection("products").get();

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render("shop", { products });

    } catch (error) {

        console.log(error);

        res.render("shop", {
            products: []
        });

    }
});

// ========================
// SERVER START
// ========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});