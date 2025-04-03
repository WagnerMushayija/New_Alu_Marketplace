

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    fetch("http://localhost:5000/api/auth/login", {
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

document.addEventListener("DOMContentLoaded", function () {
    const logInForm = document.getElementById("logInForm");
    logInForm.addEventListener("submit", handleLogin);
})

