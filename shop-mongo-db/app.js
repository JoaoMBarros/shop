const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');

const User = require('./models/user');

app = express();

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(async (req, res, next) => {
    const user = await User.findById('65f7b3330627aa72c86b4604')
    req.user = user
    next()
});

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