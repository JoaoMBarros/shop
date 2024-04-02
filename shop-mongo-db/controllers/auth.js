exports.getLogin = async (req, res, next) => {
    try {
        console.log('isLoggedIn', req.session.isLoggedIn);
        res.render('auth/login', {
            pageTitle: 'Login page',
            path: '/login',
            isLoggedIn: req.isLoggedIn,
        });
    } catch (error) {
        
        res.status(500).send({ error: 'An error occurred while loading the login page.' });
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        req.session.isLoggedIn = true;
        res.redirect('/login');
    } catch (error) {
        
        res.status(500).send({ error: 'An error occurred while logging in.' });
    }
}