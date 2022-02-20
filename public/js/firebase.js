let firebaseConfig = {
    apiKey: "AIzaSyAwU8KVjTR_zYQzaZdOdP-2Sw4yQND9J98",
    authDomain: "simple-web-blog-5f9b2.firebaseapp.com",
    projectId: "simple-web-blog-5f9b2",
    storageBucket: "simple-web-blog-5f9b2.appspot.com",
    messagingSenderId: "184808616851",
    appId: "1:184808616851:web:03063d5b3215ba11d02e66",
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

// Untuk Logout
const logoutUser = () => {
    auth.signOut();
    location.reload();
};
