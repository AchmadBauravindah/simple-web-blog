// get URL to get ID of Document Blogs in Firestore
let blogID = decodeURI(location.pathname.split("/").pop());
// get Document from Firebase Database in spesific document
let docRef = db.collection("blogs").doc(blogID);
docRef.get().then((doc) => {
    if (doc.exists) {
        // Membuat tampilan blog
        setupBlog(doc.data());
    } else {
        location.replace("/");
    }
});

// Mengatur semua yang ada di halaman blog
const setupBlog = (data) => {
    const banner = document.querySelector(".banner");
    const blogTitle = document.querySelector(".title");
    const titletag = document.querySelector("title");
    const publish = document.querySelector(".published");
    // Menambahkan image ke banner
    banner.style.backgroundImage = `url(${data.bannerImage})`;
    // Menambah title tag, judul blog dan data publish
    titletag.innerHTML += blogTitle.innerHTML = ` ${data.title}`;
    publish.innerHTML += data.publishedAt;
    publish.innerHTML += ` -- ${data.author}`;
    // Cek auth dan Show or Not Edit Button
    try {
        if (data.author == auth.currentUser.email.split("@")[0]) {
            let editBtn = document.querySelector("#edit-blog-btn");
            editBtn.style.display = "inline";
            editBtn.href = `${blogID}/editor`;
        }
    } catch {}
    // Format Article
    const article = document.querySelector(".article");
    setupArticle(article, data.article);
};

// Mengatur format artikel didalam blog
const setupArticle = (ele, data) => {
    data = data.split("\n").filter((item) => item.length);
    data.forEach((item) => {
        // Format untuk heading
        if (item[0] == "#") {
            let hCount = 0;
            let i = 0;
            while (item[i] == "#") {
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}> ${item.slice(
                hCount,
                item.length
            )}</${tag}>`;
        }
        // Format untuk image
        else if (item[0] == "!" && item[1] == "[") {
            let seperator; //untuk menyimpan index dari "]" dari teks

            for (let i = 0; i <= item.length; i++) {
                if (
                    item[i] == "]" &&
                    item[i + 1] == "(" &&
                    item[item.length - 1] == ")"
                ) {
                    // Seperator itu semacam pemisah yang akan digunakan untuk mengambil alt dan path image
                    seperator = i;
                }
            }
            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            ele.innerHTML += `
                <img src="${src}" alt="${alt}" class="article-image">
            `;
        }
        // Format untuk paragraf
        else {
            ele.innerHTML += `<p>${item}</p>`;
        }
    });
};
