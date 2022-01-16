let allMiddlewares={};

allMiddlewares.isLoggedInRegistrar = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type =='registrar') {
        return next();
    } else {
        res.redirect("/login");
    }
};

allMiddlewares.isLoggedInUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type == 'user') {
        if(req.user.status == 0) {
            res.redirect('/user/verify');
        } else if (req.user.status > 1) {
            res.redirect('/logout')
        } else {
            return next();
        }
    } else {
        res.redirect("/login");
    }
};

allMiddlewares.isLoggedInIGR = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type =='igr') {
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = allMiddlewares;