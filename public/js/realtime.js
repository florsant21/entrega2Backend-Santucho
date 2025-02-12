const socket = io();

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    if (name && price) {
        socket.emit("newProduct", { name, price });
        productForm.reset();
    }
});

socket.on("updateProducts", (products) => {
    productList.innerHTML = "";
    products.forEach((product, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${product.name} - $${product.price} <button onclick="deleteProduct(${index})">Eliminar</button>`;
        productList.appendChild(li);
    });
});

function deleteProduct(index) {
    socket.emit("deleteProduct", index);
}