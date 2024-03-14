const Cart = require('./cart');

const db = require('../util/database');

module.exports = class Product {

    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    // This method saves the product array to the file
    async save() {
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]);
    }

    // static method can be called without creating an instance of the class and returns all products
    static async fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static async findById(id) {
    }

    static async deleteById(id) {
    }
}