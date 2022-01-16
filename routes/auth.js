const express = require("express");
const router = express.Router();
const passport = require("passport");

const path = require("path");
const allMiddlewares = require('../middlewares/index');


router.get('/login', (req, res) => {
    res.render("login");
});

// User

router.post('/user/login', passport.authenticate('user', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        res.redirect('/user');
    });


// Registrar

router.post('/registrar/login', passport.authenticate('registrar', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        res.redirect('/registrar');
    });

// IGR

router.post('/igr/login', passport.authenticate('igr', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        res.redirect('/igr');
    });


// Logout

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
});

module.exports = router;