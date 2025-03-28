document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); 
  
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("User registered successfully!");
            document.getElementById("registerForm").reset(); // Clear form
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => {
        console.error("Error registering user:", error);
        alert("Failed to register. Please try again.");
    });
});
