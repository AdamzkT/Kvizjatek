//Token ellenőrzés
// Check if token exists in localStorage
const token = localStorage.getItem('adminToken');

// If no token, redirect to login page
if (!token) {
    window.location.href = "bejelentkezes.html";  // Redirect to the login page
} else {
    // Optionally, you can add code to verify token validity here, e.g., by checking expiry
    // or sending a test request to the backend if needed.
    console.log("Token exists, you are logged in!");
}

//Kijelentkezés
document.getElementById('kijelentkezes').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default action (following the link)

    // Remove token from localStorage
    localStorage.removeItem('adminToken');

    // Redirect to login page
    window.location.href = 'bejelentkezes.html';  // Redirect to the login page
});