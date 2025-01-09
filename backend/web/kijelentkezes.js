const kijelentkezes = () => {
    fetch('http://localhost:3000/kijelentkezes', {
        method: 'GET',
        credentials: 'include',  // Include session cookie for logout request
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'bejelentkezes.html';  // Redirect to login page after logout
        } else {
            console.log('Failed to log out');
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
}