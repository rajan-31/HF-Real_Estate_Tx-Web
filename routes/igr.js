const express = require("express");
const router = express.Router();
const path = require("path");

const allMiddlewares = require('../middlewares/index');

router.get('/igr', allMiddlewares.isLoggedInIGR, (req, res) => {
    res.render("igr/igr", {currentUser: req.user})
});

router.post('/igr/registrar', allMiddlewares.isLoggedInIGR, (req, res) => {
    const formData = req.body;

    const officeCode = formData.officeCode;
    const registrarPassword = formData.registrarPassword;
    const uid = formData.uid;
    const name = formData.name;

    const _username = 'admin' + '_' + req.user.id;
    const _password = formData.password;

    contract.submitTransaction('CreateOrModify_Admin', _username, _password, officeCode, registrarPassword, uid, name).then((payload) => {
        res.status(200).send("OK");
    }).catch((err) => {
        res.status(501).send(err);
    });
});

module.exports = router;