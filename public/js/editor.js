// Login User Check
auth.onAuthStateChanged((user) => {
    if (!user) {
        location.replace("/admin"); // Have to login
    }
});

// GET ALL INPUT FIELD
// Title Blog
const blogTitleField = document.querySelector(".title");
// Article Blog
const blogArticleField = document.querySelector(".article");
// Banner Blog
const banner = document.querySelector(".banner");

// Insialiasi untuk simpan lokasi banner image
let bannerPath;

// GET ALL BUTTON
// Tombol Upload Banner
const bannerImageUpload = document.querySelector("#banner-upload");
// Tombol Publish
const publishBtn = document.querySelector(".publish-btn");
// Tombol Upload Image
const imageUpload = document.querySelector("#image-upload");

// EVENT BUTTON
// Tombol Upload Banner ditekan (dengan menambahkan event "change" pada tombol)
bannerImageUpload.addEventListener("change", () => {
    uploadImage(bannerImageUpload, "banner");
});
// Tombol Upload Upload Image ditekan (dengan menambahkan event "change" pada tombol)
imageUpload.addEventListener("change", () => {
    uploadImage(imageUpload, "image");
});

// UPLOAD IMAGE TO DATABASE FOLDER "Uploads"
const uploadImage = (uploadFile, uploadType) => {
    // Simpan image file to variable array "file"
    const [file] = uploadFile.files;
    // Cek apakah yang dikirim dari user itu image atau bukan
    if (file && file.type.includes("image")) {
        // Membuat form untuk body dari requestnya
        const formdata = new FormData();
        // Tambahkan file kadalam formdata
        formdata.append("image", file);
        // request route '/upload' menggunakan fetch() method
        fetch("/upload", {
            method: "post",
            body: formdata,
        })
            // Menangkap respon dan konversi ke json
            .then((res) => res.json())
            // Menangkap url path dari image yang baru disimpan
            .then((data) => {
                // UPLOAD IMAGE
                if (uploadType == "image") {
                    addImage(data, file.name);
                } else {
                    // Membuat url image yang baru disimpan
                    bannerPath = `${location.origin}/${data}`;
                    // Menambahkan image ke style "backgroundImage"
                    banner.style.backgroundImage = `url("${bannerPath}")`;
                }
            });
    } else {
        alert("Upload image only");
    }
};

// INPUT PATH FILE (Image) to Article Field
const addImage = (imagepath, alt) => {
    let curPos = blogArticleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    blogArticleField.value =
        blogArticleField.value.slice(0, curPos) +
        textToInsert +
        blogArticleField.value.slice(curPos);
};

let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

// CREATE & EDIT BLOG
// PUBLISH BLOG (All Input) TO DATABASE
publishBtn.addEventListener("click", () => {
    // Cek apakah field kosong pada title dan artikel blog
    if (blogArticleField.value.length && blogTitleField.value.length) {
        let docName;
        // Cek URL
        if (blogID[0] == "editor") {
            // Membuat ID Blog
            let letters = "abcdefghijklmnopqrstuvwxyz";
            let blogTitle = blogTitleField.value.split(" ").join("-");
            let id = "";
            for (let i = 0; i < 4; i++) {
                id += letters[Math.floor(Math.random() * letters.length)];
            }
            // Setting Up docname yang ada pada firebase
            docName = `${blogTitle}-${id}`;
        } else {
            docName = decodeURI(blogID[0]);
        }

        let date = new Date(); // for "published at" info

        // PROSES SIMPAN DATA (Create & Edit) KE FIRESTORE
        db.collection("blogs")
            .doc(docName)
            .set({
                title: blogTitleField.value,
                article: blogArticleField.value,
                bannerImage: bannerPath,
                publishedAt: `${date.getDate()} ${
                    months[date.getMonth()]
                } ${date.getFullYear()}`,
                author: auth.currentUser.email.split("@")[0],
            })
            .then(() => {
                location.href = `/${docName}`;
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

// FILL INPUT IF EDIT SPESIFIC BLOG
let blogID = location.pathname.split("/");
blogID.shift(); // Ini akan menghapus index pertama dari split (karena index pertama empty)
// ini menandakan bahwa url != "localhost/editor" tapi "localhost/nama blog/editor"
if (blogID[0] != "editor") {
    // Fetch Data
    let docRef = db.collection("blogs").doc(decodeURI(blogID[0]));
    docRef.get().then((doc) => {
        if (doc.exists) {
            let data = doc.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            blogArticleField.value = data.article;
        } else {
            location.replace("/");
        }
    });
}
