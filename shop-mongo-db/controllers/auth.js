exports.getLogin = async (req, res, next) => {
    try {
        res.render('auth/login', {
            pageTitle: 'Login page',
            path: '/login'
        });
    } catch (error) {
        
        res.status(500).send({ error: 'An error occurred while loading the login page.' });
    }
}