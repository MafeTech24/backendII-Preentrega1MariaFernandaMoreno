const express = require("express");
const ProductsManager = require("../dao/ProductManager"); 
const { productosModelo } = require("../dao/models/productsModels");


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const {
            limit = 10,
            page = 1,
            sort,
            query
        } = req.query;

        const filtro = {};

        if (query) {
            
            if (query === "disponibles") filtro.status = true;
            else filtro.categoria = query;
        }

        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}
        };

        const totalProducts = await productosModelo.countDocuments(filtro);
        const totalPages = Math.ceil(totalProducts / limit);

        const productos = await productosModelo.find(filtro, null, options);

        res.json({
            status: "success",
            payload: productos,
            totalPages,
            prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : null,
            nextPage: parseInt(page) < totalPages ? parseInt(page) + 1 : null,
            page: parseInt(page),
            hasPrevPage: parseInt(page) > 1,
            hasNextPage: parseInt(page) < totalPages,
            prevLink: parseInt(page) > 1 ? `/api/products?limit=${limit}&page=${parseInt(page) - 1}` : null,
            nextLink: parseInt(page) < totalPages ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}` : null
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ status: "error", error: error.message });
    }
});


router.get("/:pid", async (req, res) => {
    try {
        const product = await ProductsManager.getProductBy({_id: req.params.pid});
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, status, stock, categoria, thumbnails } = req.body;

        if (!title || !description || !code || price == null || stock == null || !categoria) {
            return res.status(400).json({ 
                error: "Faltan campos obligatorios: title, description, code, price, stock, categoria"
            });
        }

        const nuevoProducto = await ProductsManager.createProduct({
            title, description, code, price, status: status ?? true, stock, categoria, thumbnails: thumbnails ?? []
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const actualizado = await ProductsManager.updateProduct(req.params.pid, req.body);
        if (!actualizado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(actualizado);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const resultado = await ProductsManager.deleteProduct(req.params.pid);
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



module.exports = router;
