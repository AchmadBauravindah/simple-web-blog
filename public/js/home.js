const blogSection = document.querySelector(".blogs-section");

// Fetch data from Firestore and Show BLog Card
db.collection("blogs")
    .get()
    .then((blogs) => {
        // Show Every Blog
        blogs.forEach((blog) => {
            // Memastikan bahwa card yang dibuat tidak sama yang ditampilkan
            if (blog.id != decodeURI(location.pathname.split("/").pop())) {
                createBlogCard(blog);
            }
        });
    });

// Membuat Card Blog
const createBlogCard = (blog) => {
    let data = blog.data();
    // Menambahkan blogSection ke halaman html
    blogSection.innerHTML += `
        <div class="blog-card">
            <img src="${data.bannerImage}" class="blog-image" alt="">
            <h1 class="blog-title">${data.title.substring(0, 100) + "..."}</h1>
            <p class="blog-overview">${
                data.article.substring(0, 200) + "..."
            }</p>
            <a href="/${blog.id}" class="btn dark">read</a>
        </div>
        `;
};
