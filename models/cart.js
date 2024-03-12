const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

module.exports = class Cart {
    static pathFile = path.resolve('data', 'cart.json');

    // This is a private method that returns a promise with the data from the file
    static async #loadData(){
        try {
            const result = await fsPromises.readFile(Cart.pathFile);
            return JSON.parse(result);
        } catch (error) {
            return null;
        }
    }

    // This method saves the cart array to the file
    static async save(cart) {
        await fsPromises.writeFile(Cart.pathFile, JSON.stringify(cart));
    }

    static async addProduct(id, productPrice) {
        try {
            // Load the existing cart (assuming Cart.loadData() exists)
            let cart = await Cart.#loadData(id);
        
            // Handle case where no cart is found
            if (!cart) {
                console.warn(`Cart not found`);
                cart = {products: [], totalPrice : 0}; // Create a new cart
            }
            
            // Find existing product in cart
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].qty += 1;
            } else {
                cart.products.push({id: id, qty: 1});
            }
            
            // Update total price
            cart.totalPrice = (cart.totalPrice || 0) + +productPrice;
        
            // Save the updated cart
            await Cart.save(cart);
            } catch (error) {
            console.error('Error loading or saving cart data:', error);
        }
    }
}