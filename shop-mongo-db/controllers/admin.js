const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product'});
}

exports.getEditProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;

    try {
        // Find the product by its ID
        const product = await Product.findById(productId);

        // If the product is not found, redirect to the home page
        if (!product) {
            return res.redirect('/');
        }

        // Render the "Edit Product" page with the product details and the edit mode status
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
            isLoggedIn: req.isLoggedIn,
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        
        res.status(500).send({ error: 'An error occurred while fetching the product.' });
    }

}

exports.postAddProduct = async (req, res, next) => {
    const user = req.user;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    try {
        // Create a new product associated with the current user
        let product = new Product({title: title, price: price, imageUrl: imageUrl, description: description, userId: user});
        
        // Save the product to the database
        await product.save();

        // Redirect the user to the /admin/products page
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error creating product:', error);
        
        res.status(500).send({ error: 'An error occurred while creating the product.' });
    }

}

exports.postEditProduct = async (req, res, next) => {
    const id = req.body.id;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    try {
        // Find the product by its ID
        let product = await Product.findById(id);

        // Update the product details
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;

        // Save the updated product to the database
        await product.save();

        // Redirect the user to the /admin/products page
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error updating product:', error);
        
        res.status(500).send({ error: 'An error occurred while updating the product.' });
    }

}

exports.postDeleteProduct = async (req, res, next) => {
    const id = req.body.id;

    try {
        // Find the product by its ID and delete it
        await Product.findByIdAndDelete(id);

        // Redirect the user to the /admin/products page
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error deleting product:', error);
        
        res.status(500).send({ error: 'An error occurred while deleting the product.' });
    }

}

exports.getProducts = async (req, res, next) => {
    try {
        // Fetch all products associated with the current user
        const products = await Product.find();

        res.render('admin/products', {prods: products, pageTitle: 'Admin Products', path: '/admin/products', isLoggedIn: req.isLoggedIn});
    } catch (error) {
        console.error('Error fetching products:', error);
        
        res.status(500).send({ error: 'An error occurred while fetching the products.' });
    }
}