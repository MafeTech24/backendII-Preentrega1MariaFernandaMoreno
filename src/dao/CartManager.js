const Cart = require('./models/cartsModels');
const Product = require('./models/productsModels'); 

class CartManager {
  
  // Crear un nuevo carrito vacío
  static async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error('Error creando carrito: ' + error.message);
    }
    }
    
    static async getAllCarts() {
  try {
    return await Cart.find({});
  } catch (error) {
    throw new Error('Error obteniendo carritos: ' + error.message);
  }
}


  // Obtener carrito por ID con productos poblados
 static async getCartById(id) {
  try {
    const cart = await Cart.findById(id).populate('products.product').exec();
    return cart;
  } catch (error) {
    throw new Error('Error buscando carrito: ' + error.message);
  }
}


  // Agregar un producto al carrito o aumentar cantidad si ya existe
  static async addProductToCart(cid, pid) {
    try {
      // Verificamos que exista el producto
      const product = await Product.findById(pid);
      if (!product) return "PRODUCT_NOT_FOUND";

      const cart = await Cart.findById(cid);
      if (!cart) return null;

      // Buscamos si el producto ya está en el carrito
      const index = cart.products.findIndex(p => p.product.toString() === pid);
      if (index !== -1) {
        cart.products[index].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return cart;

    } catch (error) {
      throw new Error('Error agregando producto al carrito: ' + error.message);
    }
  }

  // Actualizar cantidad de un producto específico en carrito
  static async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
      if (productIndex === -1) return "PRODUCT_NOT_IN_CART";

      cart.products[productIndex].quantity = quantity;

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error actualizando cantidad: ' + error.message);
    }
  }

  // Actualizar todos los productos del carrito con un arreglo nuevo
  static async updateCartProducts(cid, productsArray) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      // productsArray: [{product: 'id', quantity: n}, ...]
      cart.products = productsArray;

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error actualizando productos del carrito: ' + error.message);
    }
  }

  // Eliminar un producto específico del carrito
  static async deleteProductFromCart(cid, pid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      cart.products = cart.products.filter(p => p.product.toString() !== pid);

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error eliminando producto del carrito: ' + error.message);
    }
  }

  // Vaciar carrito (eliminar todos los productos)
  static async clearCart(cid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error vaciando carrito: ' + error.message);
    }
  }

}

module.exports = CartManager;
