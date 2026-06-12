const express = require("express");
const router = express.Router();
const db = require("../firebase");
const adminAuth = require("../middleware/adminAuth");

// ======================
// ALL BLOG POSTS (ADMIN)
// ======================
router.get("/", async (req, res) => {

    try {

        const snapshot = await db
            .collection("blogs")
            .orderBy("createdAt", "desc")
            .get();

        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render("blog/index", { posts });

    } catch (err) {

        console.log(err);
        res.send("Error loading blog");

    }
});

router.get("/admin", async (req, res) => {

    const snapshot = await db.collection("blogs").orderBy("createdAt", "desc").get();

    const blogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    res.render("admin/blogs", { blogs });
});

// ======================
// NEW BLOG FORM
// ======================
router.get("/admin/new", adminAuth, (req, res) => {
    res.render("admin/new-blog");
});

// ======================
// SAVE BLOG POST
// ======================
router.post("/admin/new", adminAuth, async (req, res) => {

    const { title, content } = req.body;

    await db.collection("blogs").add({
        title,
        content,
        createdAt: new Date()
    });

    res.redirect("/blog/admin");
});

// ======================
// DELETE BLOG
// ======================
router.get("/admin/delete/:id", async (req, res) => {

    await db.collection("blogs").doc(req.params.id).delete();

    res.redirect("/blog/admin");
});

module.exports = router;