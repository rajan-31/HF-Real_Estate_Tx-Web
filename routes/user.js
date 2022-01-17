const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const path = require("path");

const allMiddlewares = require('../middlewares/index');


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
            temp.serveyNo = list_owned[i];
            detailed_owned.push(temp);
        }

        res.render("user/user", {owned: detailed_owned});
    }).catch((err) => {
        res.render("user/user", {owned: []});
    });
});


router.post('/user/estate/availability', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const serveyNo = formData.serveyNo;
    const saleAvailability = formData.saleAvailability;

    contract.submitTransaction('ChangeAvail_Estate', serveyNo, saleAvailability).then((payload) => {
        res.status(200).send({message: 'OK'});
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/user/estate/buy', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const buyer = req.user.uid;

    const serveyNo = formData.serveyNo;
    const proposedPrice = formData.proposedPrice;

    const temp_dateTime = new Date();
    const dateTime = '20' + ("0" + temp_dateTime.getFullYear()).slice(-2) + '-' + ("0" + (temp_dateTime.getMonth() + 1)).slice(-2) + '-' + ("0" + temp_dateTime.getDate()).slice(-2) + 'T' +  ("0" + temp_dateTime.getHours()).slice(-2) + ':' + ("0" + temp_dateTime.getMinutes()).slice(-2) + ':00+05:30';

    contract.submitTransaction('RequestToBuy_Estate', buyer, serveyNo, proposedPrice, dateTime).then((payload) => {
        res.status(200).send({message: 'OK'});
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/user/estate/sell', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const username = 'user' + '_' + req.user.uid;

    const serveyNo = formData.serveyNo;
    const password = formData.password;
    const buyer = formData.buyer;
    const reason = formData.reason;

    const temp_dateTime = new Date();
    const dateTime = '20' + ("0" + temp_dateTime.getFullYear()).slice(-2) + '-' + ("0" + (temp_dateTime.getMonth() + 1)).slice(-2) + '-' + ("0" + temp_dateTime.getDate()).slice(-2) + 'T' +  ("0" + temp_dateTime.getHours()).slice(-2) + ':' + ("0" + temp_dateTime.getMinutes()).slice(-2) + ':00+05:30';

    contract.submitTransaction('AcceptRequest_Estate', username, password, serveyNo, buyer, dateTime, reason).then((payload) => {
        res.status(200).send({message: 'OK'});
    }).catch((err) => {
        res.status(501).send(err);
    });
});


//////////////////////////////////////////////

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

    const uid = req.user.uid;
    const username = 'user' + '_' + uid;
    const password = formData.password;

    const status = 1;

    contract.submitTransaction('Verify_User', username, password, uid, status).then((payload) => {
        res.status(200).send({message: 'OK'});
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/user/estate/verify', allMiddlewares.isLoggedInUser, (req, res)=>{
    const formData = req.body;

    const username = 'user' + '_' + req.user.uid;
    const password = formData.password;
    const serveyNo = formData.serveyNo;

    const status = 1;

    contract.submitTransaction('Verify_Estate', username, password, serveyNo, status).then((payload) => {
        res.status(200).send({message: 'OK'});
    }).catch((err) => {
        res.status(501).send(err);
    });
});


module.exports = router;