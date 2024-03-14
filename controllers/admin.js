const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product'});
}

exports.getEditProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;
    let product = await Product.findById(productId);
    res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/');
}

exports.postEditProduct = async (req, res, next) => {
    const id = req.body.id;
    updatedTitle = req.body.title;
    updatedImageUrl = req.body.imageUrl;
    updatedPrice = req.body.price;
    updatedDescription = req.body.description;
    const updatedProduct = new Product(id, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    await updatedProduct.save();
    res.redirect('/admin/products');
}

exports.getProducts = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('admin/products', {prods: products, pageTitle: 'Admin Products', path: '/admin/products'});
}