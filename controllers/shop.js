const Product = require('../models/product');
const Cart = require('../models/cart');

// Async function to get all products from the database with promises (therefore, the use of async/await)
exports.getProducts = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/products-list', {prods: products, pageTitle: 'Shop', path: '/products'});
}

exports.getCart = async (req, res, next) => {
    const cart = await Cart.getCart();
    const cartProducts = [];
    for (let product of cart.products) {
        let prod = await Product.findById(product.id);
        cartProducts.push({productData: prod, qty: product.qty});
    }
    res.render('shop/cart', {pageTitle: 'Your Cart', path: '/cart', products: cartProducts});
}

// Async function to get a product detail from the database with promises
exports.getProductDetail = async (req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    res.render('shop/product-detail', {product: product, pageTitle: product.title, path: '/products'});
}

// Async function to get the index page with all products from the database with promises
exports.getIndex = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/index', {prods: products, pageTitle: 'Shop', path: '/'});
}

// Async function to add a product to the cart
exports.postCart = async (req, res, next) => {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    await Cart.addProduct(product.id, product.price);
    res.redirect('/cart');
}

// Async function to delete a product from the cart
exports.postCartDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId;
    const product =  await Product.findById(productId);
    await Cart.deleteProductFromCart(productId, product.price);
    res.redirect('/cart');
}

// Async function to get the orders page
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {pageTitle: 'Your Orders', path: '/orders'});
}

// Async function to get the checkout page
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout'});
}