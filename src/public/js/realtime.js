const socket = io();

socket.on("products", (products) => {
    const list = document.getElementById("productList");
    list.innerHTML = "";
    products.forEach(product => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${product.title}</strong> - $${product.price}
                        <button onclick="deleteProduct('${product._id}')">Eliminar</button>`;
        list.appendChild(li);
    });
});

document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.price = Number(data.price);
    data.stock = Number(data.stock);
    socket.emit("addProduct", data);
    e.target.reset();
});

function deleteProduct(id) {
    socket.emit("deleteProduct", id);
}
