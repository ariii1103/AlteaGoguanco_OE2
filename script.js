// Select elements
const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productImage = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const message = document.getElementById("message");
const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const confirmationModal = document.getElementById("confirmationModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let products = []; // Store uploaded products
let productToDelete = null; // Product to delete

// Show image preview
productImage.addEventListener("change", () => {
    const file = productImage.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imagePreview.innerHTML = `<img src="${reader.result}" alt="Product Image Preview">`;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Validate and submit form
productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = productName.value.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(productPrice.value.trim());

    if (!name || !description || isNaN(price) || price <= 0) {
        message.textContent = "Please fill out all fields correctly.";
        message.style.color = "red";
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        description,
        price,
        image: imagePreview.querySelector("img")?.src || "",
        rating: null, // Initialize with no rating
    };

    products.push(newProduct);
    displayProducts();
    clearForm();
    message.textContent = "Product uploaded successfully!";
    message.style.color = "green";
});

// Display products
function displayProducts() {
    productList.innerHTML = "";
    products.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price.toFixed(2)}</p>
                <p>Rating: ${product.rating || "Not rated"}</p>
                <div class="product-rating">
                    <label for="rating-${product.id}">Rate this product:</label>
                    <input type="number" id="rating-${product.id}" min="1" max="5" step="1" />
                    <button onclick="submitRating(${product.id})">Submit Rating</button>
                </div>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="openDeleteModal(${product.id})">Delete</button>
            </div>
        `;
        productList.appendChild(productItem);
    });
}


// Edit product
function editProduct(id) {
    const product = products.find((p) => p.id === id);
    if (product) {
        productName.value = product.name;
        productDescription.value = product.description;
        productPrice.value = product.price;
        imagePreview.innerHTML = `<img src="${product.image}" alt="Product Image Preview">`;
        imagePreview.style.display = "block";

        products = products.filter((p) => p.id !== id); // Remove the product temporarily
        displayProducts();
        message.textContent = "Edit the product and resubmit.";
        message.style.color = "blue";
    }
}

// Clear form after submission
function clearForm() {
    productName.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productImage.value = "";
    imagePreview.style.display = "none";
}

// Delete product
function deleteProduct(id) {
    products = products.filter((p) => p.id !== id);
    displayProducts();
}

// Open delete confirmation modal
function openDeleteModal(id) {
    productToDelete = id;
    confirmationModal.style.display = "flex";
}

// Close delete confirmation modal
cancelDeleteBtn.addEventListener("click", () => {
    confirmationModal.style.display = "none";
});

// Confirm delete
confirmDeleteBtn.addEventListener("click", () => {
    if (productToDelete !== null) {
        deleteProduct(productToDelete);
        confirmationModal.style.display = "none";
    }
});

// File validation for image uploads
productImage.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const fileType = file ? file.type.split("/")[1] : "";
    const fileSize = file ? file.size / 1024 / 1024 : 0; // In MB

    if (file) {
        if (!["jpg", "jpeg", "png"].includes(fileType)) {
            message.textContent = "Invalid file type! Please upload a JPG, JPEG, or PNG file.";
            message.style.color = "red";
            productImage.value = "";
            return;
        }

        if (fileSize > 5) {
            message.textContent = "File size exceeds 5MB! Please upload a smaller file.";
            message.style.color = "red";
            productImage.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            imagePreview.innerHTML = `<img src="${reader.result}" alt="Product Image Preview">`;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Sort products
document.getElementById("sortNameBtn").addEventListener("click", () => {
    products.sort((a, b) => a.name.localeCompare(b.name));
    displayProducts();
});

document.getElementById("sortPriceBtn").addEventListener("click", () => {
    products.sort((a, b) => a.price - b.price);
    displayProducts();
});

// Search functionality
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
    );
    displayFilteredProducts(filteredProducts);
});

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    productList.innerHTML = "";
    filteredProducts.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price.toFixed(2)}</p>
                <p>Rating: ${product.rating || "Not rated"}</p>
                <div class="product-rating">
                    <label for="rating-${product.id}">Rate this product:</label>
                    <input type="number" id="rating-${product.id}" min="1" max="5" step="1" />
                    <button onclick="submitRating(${product.id})">Submit Rating</button>
                </div>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="openDeleteModal(${product.id})">Delete</button>
            </div>
        `;
        productList.appendChild(productItem);
    });
}


// Submit product rating
function submitRating(productId) {
    const ratingInput = document.getElementById(`rating-${productId}`);
    const rating = parseInt(ratingInput.value, 10);

    if (isNaN(rating) || rating < 1 || rating > 5) {
        alert("Invalid rating value. Please enter a rating between 1 and 5.");
        return;
    }

    const product = products.find((p) => p.id === productId);
    if (product) {
        product.rating = rating;
        console.log("Updated product rating:", product); // Debug log
        displayProducts();
        alert(`You rated "${product.name}" with ${rating} stars.`);
    } else {
        alert("Product not found.");
    }
}
