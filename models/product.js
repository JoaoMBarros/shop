const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

module.exports = class Product {
    static pathFile = path.resolve('data', 'products.json');

    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.id = Math.random().toString();
    }

    // This is a private method that returns a promise with the data from the file
    static async #loadData(){
        const result = await fsPromises.readFile(Product.pathFile);
        return JSON.parse(result); // This returns an array
    }

    // This method saves the product array to the file
    async save() {
        const products = await Product.#loadData();
        products.push(this);
        fsPromises.writeFile(Product.pathFile, JSON.stringify(products));
    }

    // static method can be called without creating an instance of the class and returns all products
    static async fetchAll() {
        let products = await Product.#loadData();
        return products;
    }

    static async findById(id) {
        const products = await Product.#loadData();
        return products.find(p => p.id === id);
    }
}