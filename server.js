const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");
// .join() -> menggabungkan string array
let initial_path = path.join(__dirname, "public");

// setup server
const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

// Routes
// Home
app.get("/", (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
});
// Editor
app.get("/editor", (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});
// Upload
app.post("/upload", (req, res) => {
    let file = req.files.image;
    let date = new Date();
    // Image Name
    let imagename = date.getDate() + date.getTime() + file.name;
    // Image Upload Path
    let path = "public/uploads/" + imagename;
    // Simpan data (file) ke Folder "Uploads" Path
    file.mv(path, (err, result) => {
        if (err) {
            throw err;
        } else {
            // Image Upload Path
            res.json(`uploads/${imagename}`);
        }
    });
});
// DASHBOARD
app.get("/admin", (req, res) => {
    res.sendFile(path.join(initial_path, "dashboard.html"));
});
// Blog spesific (show blog)
app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
});
// EDIT Blog spesific
app.get("/:blog/editor", (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});
// Error 404
app.use((req, res) => {
    res.json("404");
});

app.listen(process.env.PORT || "3000", () => {
    console.log("listening on -> http://localhost:3000");
});
