const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');

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

const db = mongoConnect.run();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});