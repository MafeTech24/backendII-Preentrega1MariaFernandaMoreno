const express = require("express");
const ProductsManager = require("../dao/ProductManager");
const productManager = new ProductsManager();

const router = express.Router();



router.get("/", async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    
    try {
        const result = await productManager.getPaginated({}, {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        });

        res.render("home", {
            products: result.docs,
            totalPages: result.totalPages,
            currentPage: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: result.limit,
        });
    } catch (error) {
        console.error("Error al renderizar home:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts(); 
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error en realtimeproducts:", error);
    res.status(500).send("Error interno del servidor");
  }
});
module.exports = router;
