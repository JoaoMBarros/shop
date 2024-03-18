const Product = require('../models/product');

// Async function to get all products from the database with promises (therefore, the use of async/await)
exports.getProducts = async (req, res, next) => {
    try {
        // Fetch all products from the database
        const products = await Product.fetchAll();
    
        // Render the 'shop/product-list' view with the products and additional data
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        
        res.status(500).send({ error: 'An error occurred while fetching the products.' });
    }
    
}

exports.getCart = async (req, res, next) => {

    try {
        let cart = await req.user.getCart();

        let products = await cart.getProducts();

        res.render('shop/cart', { path: '/cart', pageTitle: 'Your Cart', products: products });

    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

// Async function to get a product detail from the database with promises
exports.getProductDetail = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        res.render('shop/product-detail', {product: product, pageTitle: product.title, path: '/products'});

    } catch (error) {
        console.error('Error fetching product:', error);
        
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }

    
}

// Async function to get the index page with all products from the database with promises
exports.getIndex = async (req, res, next) => {
}

// Async function to add a product to the cart
exports.postCart = async (req, res, next) => {
    const productId = req.body.productId;

    try {
        // Fetch the user's cart
        const fetchedCart = await req.user.getCart();

        // Try to find the product in the cart
        const cartProducts = await fetchedCart.getProducts({ where: { id: productId } });

        // Determine the new quantity and whether to add or update the product in the cart
        let newQuantity = 1;
        if (cartProducts.length > 0) {
            // Product is already in the cart, increase the quantity
            const product = cartProducts[0];
            newQuantity = product.cartItem.quantity + 1;
            await fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        } else {
            // Product is not in the cart, add it
            const product = await Product.findByPk(productId);
            await fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        }
    } catch (error) {
        console.error('Error processing cart operation:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }

    res.redirect('/cart');
}

// Async function to delete a product from the cart
exports.postCartDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId;
    user = req.user;

    try{
        // Fetch the product from the cart
        const cart =  await user.getCart();

        let product = await cart.getProducts({where: {id: productId}});

        // Delete the product from the cartItem table
        await product[0].cartItem.destroy();

        res.redirect('/cart');
    } catch (error) {
        console.error('Error deleting product from cart:', error);

        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

exports.postOrder = async (req, res, next) => {
    const user = req.user;

    try{
        const cart = await user.getCart();
        const products = await cart.getProducts();
        const order = await user.createOrder();

        // Add the products to the order
        await order.addProducts(products.map(product => {

            // Set the orderItem quantity to the cartItem quantity
            product.orderItem = { quantity: product.cartItem.quantity };

            return product;
        }));

        // Clear the cart
        await cart.setProducts(null);

        res.redirect('/orders');

    } catch (error) {
        console.error('Error fetching products from cart:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

// Async function to get the orders page
exports.getOrders = async (req, res, next) => {
    const user = req.user;

    try{
        const orders = await user.getOrders( { include: ['products'] });


        res.render('shop/orders', {pageTitle: 'Your Orders', path: '/orders', orders: orders});
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

// Async function to get the checkout page
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout'});
}