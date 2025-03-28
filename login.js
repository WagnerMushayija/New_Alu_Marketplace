

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent = "Invalid username or password!";
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        errorMessage.textContent = "An error occurred during login!";
    });
}
