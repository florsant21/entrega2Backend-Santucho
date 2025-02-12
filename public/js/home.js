const socket = io();
const productList = document.getElementById("productList");

socket.on("updateProducts", (products) => {
    productList.innerHTML = "";
    products.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product.name} - $${product.price}`;
        productList.appendChild(li);
    });
});
