let ul = document.querySelector(".links-container");

auth.onAuthStateChanged((user) => {
    if (user) {
        // User Logged
        ul.innerHTML += `
        <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>
        <li class="link-item"><a href="#" onclick="logoutUser()" class="link">Logout</a></li>
        `;
    } else {
        // No One User Logged
        ul.innerHTML += `
        <li class="link-item"><a href="/admin" class="link">Login</a></li>
        `;
    }
});

document.querySelector(".logo").onclick = function () {
    location.href = "/";
};
