const Product = require('../models/product');

// Async function to get all products from the database with promises (therefore, the use of async/await)
exports.getProducts = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/products-list', {prods: products, pageTitle: 'Shop', path: '/products'});
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

// Async function to get the cart page
exports.getCart = (req, res, next) => {
    res.render('shop/cart', {pageTitle: 'Your Cart', path: '/cart'});
}

// Async function to add a product to the cart
exports.postCart = async (req, res, next) => {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
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