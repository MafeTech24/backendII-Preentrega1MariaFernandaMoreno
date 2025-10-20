const express = require("express");
const CartManager = require("../dao/CartManager");

const router = express.Router();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const carrito = await CartManager.createCart();
    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Obtener todos los carritos 
router.get("/", async (req, res) => {
  try {
    const carts = await CartManager.getAllCarts(); 
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Agregar un producto al carrito (o aumentar cantidad)
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const result = await CartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!result) return res.status(404).json({ error: "Carrito no encontrado" });
    if (result === "PRODUCT_NOT_FOUND") return res.status(404).json({ error: "Producto no encontrado" });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const result = await CartManager.deleteProductFromCart(req.params.cid, req.params.pid);
    if (!result) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json({ message: "Producto eliminado del carrito", cart: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reemplazar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const productsArray = req.body.products;
    if (!Array.isArray(productsArray)) {
      return res.status(400).json({ error: "El cuerpo debe contener un array de productos" });
    }

    const result = await CartManager.updateCartProducts(req.params.cid, productsArray);
    if (!result) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json({ message: "Carrito actualizado", cart: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Actualizar cantidad de un producto específico
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    const result = await CartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!result) return res.status(404).json({ error: "Carrito no encontrado" });
    if (result === "PRODUCT_NOT_IN_CART") {
      return res.status(404).json({ error: "Producto no está en el carrito" });
    }

    res.json({ message: "Cantidad actualizada", cart: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vaciar carrito completamente
router.delete("/:cid", async (req, res) => {
  try {
    const result = await CartManager.clearCart(req.params.cid);
    if (!result) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json({ message: "Carrito vaciado", cart: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
