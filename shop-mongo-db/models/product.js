const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, imageUrl, description, id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = new mongodb.ObjectId(userId);
    }

    async save() {
        const db = getDb();
        let dbOperation;
        if (this._id){
            // Update the product
            dbOperation = db.collection('products').updateOne({ _id: this._id }, { $set: this });
        } else {
            // Insert the product
            dbOperation = db.collection('products').insertOne(this);
        }

        return dbOperation;
    }

    static async fetchAll() {
        const db = getDb();

        // The toArray() method returns a promise that resolves with an array of all the documents from the cursor
        return db.collection('products').find().toArray();
    }

    static async findById(productId) {
        const db = getDb();

        // The next() method returns the next document from the cursor that the find() method returns
        return db.collection('products').findOne({ _id: new mongodb.ObjectId(productId) });
    }

    static async deleteById(productId) {
        const db = getDb();

        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(productId) });
    }
}

module.exports = Product;