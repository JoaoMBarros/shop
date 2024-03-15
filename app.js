const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

app = express();

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/favicon.ico', (req, res, next) => {
    res.sendStatus(204);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });