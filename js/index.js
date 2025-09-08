// Load All Categories
const loadCategories = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();
  displayCategories(data.data);
};

// Display Categories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className =
      "btn btn-sm w-full text-left bg-green-200 hover:bg-green-300 category-btn";
    btn.innerText = cat.category;

    // Click event
    btn.onclick = () => {
      // Active state
      document.querySelectorAll(".category-btn").forEach((b) => {
        b.classList.remove("bg-green-600", "text-white");
        b.classList.add("bg-green-200");
      });
      btn.classList.remove("bg-green-200");
      btn.classList.add("bg-green-600", "text-white");

      // Load trees
      loadTreesByCategory(cat.id);
    };

    categoryContainer.appendChild(btn);
  });
};

// Utility functions for showing/hiding the loader
const showLoader = () => {
    document.getElementById('loader').classList.remove('hidden');
};

const hideLoader = () => {
    document.getElementById('loader').classList.add('hidden');
};

// Load Trees by Category
const loadTreesByCategory = async (id) => {
    showLoader(); // Show the loader before fetching data
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    displayTrees(data.data);
    hideLoader(); // Hide the loader after data is displayed
};

// Display Trees
const displayTrees = (trees) => {
    const treeContainer = document.getElementById("tree-container");
    treeContainer.innerHTML = "";

    if (!trees) {
      treeContainer.innerHTML = "<p class='text-center text-gray-500'>No trees found in this category.</p>";
      return;
    }

    trees.forEach((tree) => {
        const div = document.createElement("div");
        div.className = "card bg-white shadow-md p-4 rounded-md";

        div.innerHTML = `
            <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded-md mb-3">
            <h3 class="font-bold">${tree.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${tree.description.slice(0, 60)}...</p>
            <span class="badge bg-green-100 text-green-600 mb-2">${tree.category}</span>
            <p class="font-bold">৳${tree.price}</p>
            <button class="btn btn-sm bg-green-600 text-white mt-2 w-full">Add to Cart</button>
        `;

        // Add to Cart button
        div.querySelector("button").onclick = () => addToCart(tree);

        treeContainer.appendChild(div);
    });
};

// Cart Functionality
let cart = [];

const addToCart = (tree) => {
    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.id === tree.id);

    if (existingItem) {
        // If it exists, just increment the quantity
        existingItem.quantity++;
    } else {
        // If not, add the new tree to the cart with a quantity of 1
        cart.push({ ...tree, quantity: 1 });
    }
    displayCart();
};

const displayCart = () => {
    const cartContainer = document.getElementById("cart-container");
    const totalPriceElement = document.getElementById("total-price");

    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p class='text-center text-gray-500'>Your cart is empty.</p>";
        totalPriceElement.innerText = "৳0";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-white p-2 rounded shadow-sm";
        div.innerHTML = `
            <span>${item.name} (${item.quantity}) - ৳${item.price * item.quantity}</span>
            <button class="text-red-500" onclick="removeFromCart(${index})">❌</button>
        `;
        cartContainer.appendChild(div);
    });

    totalPriceElement.innerText = "৳" + total.toFixed(2); // Use toFixed for better price formatting
};

const removeFromCart = (index) => {
    cart.splice(index, 1);
    displayCart();
};

// Load All Plants from a separate API
const loadAllTrees = async () => {
    showLoader();
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    displayTrees(data.plants);
    hideLoader();
};

// Initial Load
loadCategories();
loadAllTrees();