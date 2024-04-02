const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const session = require('express-session');

const User = require('./models/user');

app = express();

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({secret: 'my secret', resave: false, saveUninitialized: false}));

app.use(async (req, res, next) => {
    const user = await User.findOne();
    req.user = user;
    next()
});

app.get('/favicon.ico', (req, res, next) => {
    res.sendStatus(204);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose.connect('mongodb+srv://joao:lECi55T9DuX2XRaz@cluster0.a2iix0j.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Joao',
                    email: 'joao@email.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
        console.log('Connected to MongoDB and listening on port 3000');
    });