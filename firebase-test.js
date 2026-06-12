const admin = require("firebase-admin");

console.log("admin loaded:", typeof admin);
console.log("credential exists:", !!admin.credential);
console.log("cert exists:", admin.credential?.cert);