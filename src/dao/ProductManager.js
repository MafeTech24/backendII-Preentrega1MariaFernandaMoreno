const { productosModelo } = require("../dao/models/productsModels.js");

class ProductsManager {
  async getPaginated(filtro = {}, options = {}) {
    return await productosModelo.paginate(filtro, options);
  }

  async getProducts() {
    return await productosModelo.find();
  }

  async getProductBy(filtro = {}) {
    return await productosModelo.findOne(filtro);
  }

  async createProduct(product) {
  return await productosModelo.create(product);
}
  async addProducts(product) {
    return await productosModelo.create(product);
  }

  async updateProduct(id, product) {
    return await productosModelo.findByIdAndUpdate(id, product, { new: true });
  }

  async deleteProduct(id) {
    return await productosModelo.findByIdAndDelete(id);
  }
}

module.exports = ProductsManager;
