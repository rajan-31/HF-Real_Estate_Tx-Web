const express = require("express");
const router = express.Router();
const path = require("path");

const allMiddlewares = require('../middlewares/index');


router.get('/registrar', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    const key = 'admin' + '_' + req.user.officeCode;
    contract.evaluateTransaction('GetValue', key).then(async (payload) => {
        const user_data = JSON.parse( payload.toString() );
        const list_toApprove = user_data.toApprove;
        
        res.render("registrar/registrar", {currentUser: req.user, toApprove: list_toApprove})
    }).catch((err) => {
        res.render("registrar/registrar", {currentUser: req.user, toApprove: []})
    });
});


router.post('/registrar/user', allMiddlewares.isLoggedInRegistrar, (req, res)=>{
    const formData = req.body;

    const uid = formData.uid;
    const password = formData.password;
    const name = formData.name;

    contract.submitTransaction('Create_User', uid, password, name).then((payload) => {
        res.status(200).json(JSON.parse(payload.toString()));
    }).catch((err) => {
        res.status(501).send(err);
    });
});

router.put('/registrar/user', allMiddlewares.isLoggedInRegistrar, (req, res)=>{
    const formData = req.body;

    const uid = formData.uid;
    const name = formData.name;

    const status = formData.status == "" ? -1 : formData.status == "not verified" ? 0 : 2;

    contract.submitTransaction('Modify_User', uid, name, status).then((payload) => {
        res.status(200).json(JSON.parse(payload.toString()));
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/registrar/estate', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    const formData = req.body;

    const officeCode = req.user.officeCode;

    const serveyNo = formData.serveyNo;
    const owner = formData.owner;
    const location = formData.location;
    const area = formData.area;
    const purchasedOn = formData.purchasedOn;
    const transactionsCount = formData.transactionsCount;

    contract.submitTransaction('Create_Estate', officeCode, serveyNo, owner, location, area, purchasedOn, transactionsCount).then((payload) => {
        res.status(200).json(JSON.parse(payload.toString()));
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.put('/registrar/estate', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    const formData = req.body;

    const officeCode = req.user.officeCode;
    const serveyNo = formData.serveyNo;

    const location = formData.location;
    const area = formData.area == "" ? -1 : formData.area;
    const purchasedOn = formData.purchasedOn;
    const transactionsCount = formData.transactionsCount == "" ? -1 : formData.transactionsCount;

    contract.submitTransaction('Modify_Estate', officeCode, serveyNo, location, area, purchasedOn, transactionsCount).then((payload) => {
        res.status(200).json(JSON.parse(payload.toString()));
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/registrar/sell', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    const formData = req.body;

    const username = 'admin' + '_' + req.user.officeCode;

    const serveyNo = formData.serveyNo;
    const password = formData.password;

    const temp_dateTime = new Date();
    const dateTime = '20' + ("0" + temp_dateTime.getFullYear()).slice(-2) + '-' + ("0" + (temp_dateTime.getMonth() + 1)).slice(-2) + '-' + ("0" + temp_dateTime.getDate()).slice(-2) + 'T' +  ("0" + temp_dateTime.getHours()).slice(-2) + ':' + ("0" + temp_dateTime.getMinutes()).slice(-2) + ':00+05:30';

    contract.submitTransaction('ApproveSell_Estate', username, password, serveyNo, dateTime).then((payload) => {
        res.status(200).json(JSON.parse(payload.toString()));
    }).catch((err) => {
        res.status(501).send(JSON.parse(err.toString()));
    });
});


module.exports = router;