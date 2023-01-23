const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const path = require("path");

const allMiddlewares = require('../middlewares/index');
const Estate = require('../models/Estate');


router.get('/user', allMiddlewares.isLoggedInUser,  (req, res) => {
    const key = 'user' + '_' + req.user.uid;
    contract.evaluateTransaction('GetValue', key).then(async (payload) => {
        const user_data = JSON.parse( payload.toString() );
        const list_owned = user_data.owned;
        const detailed_owned = [];

        for(let i=0; i<list_owned.length; i++) {
            const key2 = 'estate' + '_' + list_owned[i];
            const result = await contract.evaluateTransaction('GetValue', key2);

            const temp = JSON.parse(result.toString());
            temp.ulpin = list_owned[i];
            detailed_owned.push(temp);
        }

        res.render("user/user", {owned: detailed_owned, requested: user_data.requested});
    }).catch((err) => {
        res.render("user/user", {owned: [], requested: []});
    });
});


router.post('/user/estate/availability', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const ulpin = formData.ulpin;
    const saleAvailability = formData.saleAvailability;

    contract.submitTransaction('ChangeAvail_Estate', ulpin, saleAvailability).then((payload) => {

        Estate.updateOne({ ulpin: ulpin }, { saleAvailability: saleAvailability }, (err) => {
            if (err) console.log(err);

            res.status(200).send({ message: 'OK' });
        }).lean();
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/user/estate/buy', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const buyer = req.user.uid;
    const name = req.user.name

    const ulpin = formData.ulpin;
    const proposedPrice = formData.proposedPrice;

    const temp_dateTime = new Date();
    const dateTime = '20' + ("0" + temp_dateTime.getFullYear()).slice(-2) + '-' + ("0" + (temp_dateTime.getMonth() + 1)).slice(-2) + '-' + ("0" + temp_dateTime.getDate()).slice(-2) + 'T' +  ("0" + temp_dateTime.getHours()).slice(-2) + ':' + ("0" + temp_dateTime.getMinutes()).slice(-2) + ":" + ("0" + temp_dateTime.getSeconds()).slice(-2) + '+05:30';

    contract.submitTransaction('RequestToBuy_Estate', buyer, name, ulpin, proposedPrice, dateTime).then((payload) => {
        res.status(200).send({message: 'OK'});
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/user/estate/sell', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const username = 'user' + '_' + req.user.uid;

    const ulpin = formData.ulpin;
    const password = formData.password;
    const buyer = formData.buyer;
    const reason = formData.reason;

    const temp_dateTime = new Date();
    const dateTime = '20' + ("0" + temp_dateTime.getFullYear()).slice(-2) + '-' + ("0" + (temp_dateTime.getMonth() + 1)).slice(-2) + '-' + ("0" + temp_dateTime.getDate()).slice(-2) + 'T' +  ("0" + temp_dateTime.getHours()).slice(-2) + ':' + ("0" + temp_dateTime.getMinutes()).slice(-2) + ":" + ("0" + temp_dateTime.getSeconds()).slice(-2) + '+05:30';

    contract.submitTransaction('AcceptRequest_Estate', username, password, ulpin, buyer, dateTime, reason).then((payload) => {

        Estate.updateOne({ ulpin: ulpin }, { beingSold: true }, (err) => {
            if (err) console.log(err);

            res.status(200).send({ message: 'OK' });
        }).lean();
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.delete('/user/estate/sell', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const ulpin = formData.ulpin;
    const buyer = formData.buyer || "";

    contract.submitTransaction('ClearRequests_Estate', ulpin, buyer).then((payload) => {
        res.status(200).send({message: 'OK'});
    }).catch((err) => {
        res.status(501).send(err);
    });
});


//////////////////////////////////////////////

router.post('/user/signup', (req, res)=>{
    const formData = req.body;

    const uid = formData.uid;
    const name = formData.name;

    contract.submitTransaction('Create_User', uid, name).then((payload) => {
        res.redirect('/login');
    }).catch((err) => {
        res.redirect('/');
    });
});

router.get('/user/verify', (req, res, next) => {
    if(req.isAuthenticated() && req.user.type == 'user' && req.user.status == 0) {
        return next();
    } else {
        res.redirect('/');
    }
}, (req, res) => {
    res.render("user/verify", {currentUser: req.user});
});

router.post('/user/verify', (req, res, next) => {
    if(req.isAuthenticated() && req.user.type == 'user' && req.user.status == 0) {
        return next();
    } else {
        res.redirect('/');
    }
}, (req, res)=>{
    const formData = req.body;

    const username = 'user' + '_' + req.user.uid;
    const oldPass = formData.oldPass;
    const newPass = formData.newPass;

    const status = 1;

    contract.submitTransaction('Verify_User', username, oldPass, status, newPass).then((payload) => {
        res.status(200).send({message: 'OK'});
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/user/estate/verify', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const username = 'user' + '_' + req.user.uid;
    const password = formData.password;
    const ulpin = formData.ulpin;

    const status = 1;

    contract.submitTransaction('Verify_Estate', username, password, ulpin, status).then((payload) => {
        res.status(200).send({message: 'OK'});


    }).catch((err) => {
        res.status(501).send(err);
    });
});


module.exports = router;