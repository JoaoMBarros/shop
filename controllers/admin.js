const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product'});
}

exports.getEditProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;
    Product.findByPk(productId)
        .then(product => {
            res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
        });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({title: title, price: price, imageUrl: imageUrl, description: description})
        .then(result => {
            res.redirect('/admin/products');
    });
}

exports.postEditProduct = async (req, res, next) => {
    const id = req.body.id;
    updatedTitle = req.body.title;
    updatedImageUrl = req.body.imageUrl;
    updatedPrice = req.body.price;
    updatedDescription = req.body.description;
    Product.findByPk(id)
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDescription;
            return product.save();
        })

        // This .then block is executed after the product.save() promise is resolved
        .then(result => {
            res.redirect('/admin/products');
        });
}

exports.postDeleteProduct = async (req, res, next) => {
    const id = req.body.id;
    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            res.redirect('/admin/products');
        });
}

exports.getProducts = async (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {prods: products, pageTitle: 'Admin Products', path: '/admin/products'});
        });
}