const Product = require('../models/product');
const Order = require('../models/order');

// Async function to get the index page with all products from the database with promises
exports.getIndex = async (req, res, next) => {
}

// Async function to get all products from the database with promises (therefore, the use of async/await)
exports.getProducts = async (req, res, next) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();
    
        // Render the 'shop/product-list' view with the products and additional data
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            isLoggedIn: req.isLoggedIn
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        
        res.status(500).send({ error: 'An error occurred while fetching the products.' });
    }
    
}

// Async function to get a product detail from the database with promises
exports.getProductDetail = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        res.render('shop/product-detail', {product: product, pageTitle: product.title, path: '/products', isLoggedIn: req.isLoggedIn});

    } catch (error) {
        console.error('Error fetching product:', error);
        
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }

    
}

// Async function to get the cart page
exports.getCart = async (req, res, next) => {

    try {
        // Fetch the user's cart and populate the products
        await req.user.populate('cart.items.productId');
        const userCartProducts = req.user.cart.items;
        res.render('shop/cart', { path: '/cart', pageTitle: 'Your Cart', products: userCartProducts, isLoggedIn: req.isLoggedIn });

    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

// Async function to add a product to the cart
exports.postCart = async (req, res, next) => {
    const productId = req.body.productId;

    try {
        const product = await Product.findById(productId);
        
        await req.user.addToCart(product);
        

        res.redirect('/cart');

    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }

}

// Async function to delete a product from the cart
exports.postCartDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId;
    user = req.user;

    try{
        // Fetch the product from the cart
        await user.removeFromCart(productId);

        res.redirect('/cart');
    } catch (error) {
        console.error('Error deleting product from cart:', error);

        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

// Async function to get the orders page
exports.getOrders = async (req, res, next) => {
    const user = req.user;
    try{
        const orders = await Order.find({'user.userId' : user._id});

        res.render('shop/orders', {pageTitle: 'Your Orders', path: '/orders', orders: orders, isLoggedIn: req.isLoggedIn});
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

// Async function to post an order
exports.postOrder = async (req, res, next) => {
    try{
        const user = req.user;
        await req.user.populate('cart.items.productId');
        const userCartProducts = req.user.cart.items;


        const order = new Order({
            user: {
                name: user.name,
                userId: user
            },
            products: userCartProducts.map(product => {
                return {product: {...product.productId._doc}, quantity: product.quantity};
            })
        });

        await order.save();

        await user.clearCart();

        res.redirect('/orders');

    } catch (error) {
        console.error('Error fetching products from cart:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

// Async function to get the checkout page
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout'});
}