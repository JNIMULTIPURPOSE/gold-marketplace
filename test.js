const db = require("./firebase");

async function test() {
  try {
    await db.collection("test").add({
      message: "Firebase connected successfully",
      createdAt: new Date()
    });

    console.log("Firestore connected!");
  } catch (error) {
    console.error(error);
  }
}

test();