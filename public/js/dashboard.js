// Check Login User
auth.onAuthStateChanged((user) => {
    if (user) {
        login.style.display = "none";
    } else {
        setupLoginButton();
    }
});

// Create UI Login from FirebaseUI
let ui = new firebaseui.auth.AuthUI(auth);
let login = document.querySelector(".login");
const blogSection = document.querySelector(".blogs-section");
let currentUser;

// Proses Login
const setupLoginButton = () => {
    ui.start("#loginUI", {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectURL) {
                login.style.display = "none";
                return false;
            },
        },
        signInFlow: "popup",
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    });
};

// Ambil data user login
const getUserWrittenBlogs = () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            db.collection("blogs")
                .where("author", "==", auth.currentUser.email.split("@")[0])
                .get()
                .then((blogs) => {
                    blogs.forEach((blog) => {
                        createCardBlog(blog);
                    });
                })
                .catch((err) => {
                    console.log("Blog gagal dimuat");
                });
        }
    });
};

getUserWrittenBlogs();

const createCardBlog = (blog) => {
    let data = blog.data();
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + "..."}</h1>
        <p class="blog-overview">${data.article.substring(0, 200) + "..."}</p>
        <a href="/${blog.id}" class="btn dark">read</a>
        <a href="/${blog.id}/editor" class="btn grey">edit</a>
        <a href="#" onclick="deleteBlog('${
            blog.id
        }')" class="btn danger">delete</a>
    </div>
    `;
};

// DELETE BLOG
const deleteBlog = (id) => {
    db.collection("blogs")
        .doc(id)
        .delete()
        .then(() => {
            location.reload();
        })
        .catch((err) => {
            console.log("Error deleting the blog");
        });
};
