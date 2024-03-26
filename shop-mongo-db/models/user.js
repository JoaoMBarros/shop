const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {   
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
                quantity: { type: Number, required: true } 
            }
        ]
    }
});

userSchema.methods.addToCart = async function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({productId: product._id, quantity: newQuantity});
    }
    this.cart.items = updatedCartItems;
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;


// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart ? cart : {};
//         this._id = id;
//         this.cart.items = cart ? cart.items : [];
//     }

//     async save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//     }

//     async addToCart(product){
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if(cartProductIndex >= 0){
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: newQuantity});
//         }
//         const updatedCart = {items: updatedCartItems};
//         const db = getDb();
//         return db.collection('users').updateOne(
//             {_id: new mongodb.ObjectId(this._id)},
//             {$set: {cart: updatedCart}},
//             {upsert: true}
//         );
//     }

//     async removeFromCart(productId){
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getDb();
//         return db.collection('users').updateOne(
//             {_id: new mongodb.ObjectId(this._id)},
//             {$set: {cart: {items: updatedCartItems}}}
//         );
//     }

//     async getCartProducts() {
//         try {
//             const db = getDb();
//             const productIds = this.cart.items.map(item => item.productId);
            
//             console.log(productIds)

//             // Encontrar produtos correspondentes aos IDs no carrinho
//             const products = await db.collection('products').find({ _id: { $in: productIds } }).toArray();

//             for (let productId of productIds) {
//                 if (!products.find(product => product._id.toString() === productId.toString())) {
//                     // Remover o item do carrinho se o produto não for encontrado
//                     await this.removeFromCart(productId);
//                 }
//             }

//             // Mapear os produtos para incluir a quantidade do carrinho
//             const productsWithQuantity = products.map(product => {
//                 const cartItem = this.cart.items.find(item => item.productId.toString() === product._id.toString());
//                 return {
//                     ...product,
//                     quantity: cartItem ? cartItem.quantity : 0
//                 };
//             });
    
//             return productsWithQuantity;
//         } catch (error) {
//             console.error("Erro ao obter produtos do carrinho:", error);

//             throw error;
//         }
//     }    

//     async addOrder() {
//         try {
//             const db = getDb();
//             const products = await this.getCartProducts();
    
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectId(this._id),
//                     name: this.username
//                 }
//             };
    
//             // Inserir o pedido
//             const insertResult = await db.collection('orders').insertOne(order);
    
//             // Atualizar o carrinho do usuário
//             const updateResult = await db.collection('users').updateOne(
//                 {_id: new mongodb.ObjectId(this._id)},
//                 {$set: {cart: {items: []}}}
//             );
    
//             // Limpar o carrinho local
//             this.cart = {items: []};
    
//             return {insertResult, updateResult};
//         } catch (error) {
//             console.error("Erro ao adicionar pedido:", error);
//             throw error;
//         }
//     }
    
//     async getOrders() {
//         try {
//             const db = getDb();
    
//             // Encontrar pedidos correspondentes ao usuário
//             const orders = await db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray();
    
//             return orders;
//         } catch (error) {
//             console.error("Erro ao obter pedidos:", error);
//             throw error;
//         }
//     }

//     static async findById(userId) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) });
//     }
// }

// module.exports = User;