// const ApiKey = "51e0340903ab81aa5b673b2339f4a098"

fetch('http://localhost:5000/api/product-categories')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const dataContainer = document.getElementById("cat-list");
        dataContainer.innerHTML = "";
        data.forEach(item => {
            const aListItem = document.createElement("a");
            const listItem = document.createElement("li");
            aListItem.textContent = item.name;
            listItem.classList.add("cat-list-item");
            listItem.appendChild(aListItem);
            dataContainer.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error fetching categories:", error);
    });

// Fetch and display products
fetch('http://localhost:5000/api/products')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const dataContainer = document.getElementById("product-list");
        dataContainer.innerHTML = "";
        data.forEach(item => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");

            const productName = document.createElement("h3");
            productName.textContent = item.name;

            const productPrice = document.createElement("p");
            productPrice.textContent = `Price: $${item.price}`;

            productItem.appendChild(productName);
            productItem.appendChild(productPrice);
            dataContainer.appendChild(productItem);
        });
    })
    .catch(error => {
        console.error("Error fetching products:", error);
    });



