const socket = io();

// Capturar el formulario y la lista de productos
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

// Enviar un nuevo producto al servidor
productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    if (name && price) {
        socket.emit("newProduct", { name, price });
        productForm.reset();
    }
});

// Escuchar actualizaciones de productos y renderizar la lista
socket.on("updateProducts", (products) => {
    productList.innerHTML = "";
    products.forEach((product, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${product.name} - $${product.price} <button onclick="deleteProduct(${index})">Eliminar</button>`;
        productList.appendChild(li);
    });
});

// Función para eliminar un producto
function deleteProduct(index) {
    socket.emit("deleteProduct", index);
}