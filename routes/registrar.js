const express = require("express");
const router = express.Router();
const path = require("path");

const allMiddlewares = require('../middlewares/index');

const Estate = require('../models/Estate');

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


/* router.post('/registrar/user', allMiddlewares.isLoggedInRegistrar, (req, res)=>{
    const formData = req.body;

    const uid = formData.uid;
    const password = formData.password;
    const name = formData.name;

    contract.submitTransaction('Create_User', uid, password, name).then((payload) => {
        res.status(200).json(JSON.parse(payload.toString()));
    }).catch((err) => {
        res.status(501).send(err);
    });
}); */

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

    const ulpin = formData.ulpin;
    const owner = formData.owner;
    const location = formData.location;
    const area = formData.area;
    const purchasedOn = formData.purchasedOn;
    const transactionsCount = formData.transactionsCount;

    contract.submitTransaction('Create_Estate', officeCode, ulpin, owner, location, area, purchasedOn, transactionsCount).then((payload) => {

        Estate.create({
            ulpin: ulpin,
            owner: owner,
            officeCode: officeCode,
            location: location,
            area: area,
            status: 0,
            purchasedOn: purchasedOn,
            saleAvailability: false,
            beingSold: false
        }, (err, data) => {
            if (err) {
                console.log(err);
            }

            console.log(data);
            res.status(200).json(JSON.parse(payload.toString()));
        });

    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.put('/registrar/estate', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    const formData = req.body;

    const officeCode = req.user.officeCode;
    const ulpin = formData.ulpin;

    const location = formData.location;
    const area = formData.area == "" ? -1 : formData.area;
    const purchasedOn = formData.purchasedOn;
    const transactionsCount = formData.transactionsCount == "" ? -1 : formData.transactionsCount;

    contract.submitTransaction('Modify_Estate', officeCode, ulpin, location, area, purchasedOn, transactionsCount).then((payload) => {
        Estate.updateOne({ ulpin: ulpin }, {
            area: area,
            location: location,
            purchasedOn: purchasedOn
        }, (err, data) => {
            if (err) {
                console.log(err);
            }

            console.log(data);
            res.status(200).json(JSON.parse(payload.toString()));
        });
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/registrar/sell', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    const formData = req.body;

    const username = 'admin' + '_' + req.user.officeCode;

    const ulpin = formData.ulpin;
    const action = formData.action;

    const seller = formData.seller;
    const buyer = formData.buyer;

    if(action === "accept") {
        const temp_dateTime = new Date();
        const dateTime = '20' + ("0" + temp_dateTime.getFullYear()).slice(-2) + '-' + ("0" + (temp_dateTime.getMonth() + 1)).slice(-2) + '-' + ("0" + temp_dateTime.getDate()).slice(-2) + 'T' +  ("0" + temp_dateTime.getHours()).slice(-2) + ':' + ("0" + temp_dateTime.getMinutes()).slice(-2) + ":" + ("0" + temp_dateTime.getSeconds()).slice(-2) + '+05:30';

        contract.submitTransaction('ApproveSell_Estate', username, ulpin, dateTime).then((payload) => {

            Estate.updateOne({ ulpin: ulpin }, {
                owner: buyer,
                purchasedOn: dateTime,
                beingSold: false,
                saleAvailability: false
            }, (err, data) => {
                if (err) {
                    console.log(err);
                }

                console.log(data);
                res.status(200).json(JSON.parse(payload.toString()));
            });
        }).catch((err) => {
            res.status(501).send(JSON.parse(err.toString()));
        });

    } else {
        contract.submitTransaction('RejectSell_Estate', username, ulpin).then((payload) => {

            Estate.updateOne({ ulpin: ulpin }, {
                beingSold: false,
            }, (err, data) => {
                if (err) {
                    console.log(err);
                }

                console.log(data);
                res.status(200).json(JSON.parse(payload.toString()));
            });
        }).catch((err) => {
            res.status(501).send(err);
        });
    }
});


router.post('/registrar/transaction', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    const formData = req.body;

    const ulpin = formData.ulpin;
    const num = formData.num;
    const seller = formData.seller;
    const buyer = formData.buyer;
    const reason = formData.reason;
    const proposedPrice = formData.proposedPrice;

    const temp_tDateTime = new Date(formData.tDateTime);
    const tDateTime = '20' + ("0" + temp_tDateTime.getFullYear()).slice(-2) + '-' + ("0" + (temp_tDateTime.getMonth() + 1)).slice(-2) + '-' + ("0" + temp_tDateTime.getDate()).slice(-2) + 'T' +  ("0" + temp_tDateTime.getHours()).slice(-2) + ':' + ("0" + temp_tDateTime.getMinutes()).slice(-2) + ":" + ("0" + temp_tDateTime.getSeconds()).slice(-2) + '+05:30';

    const officeCode = formData.officeCode; res.status(200).send({ message: 'OK' });
    const approvedBy = formData.approvedBy;

    const temp_aDateTime = new Date(formData.aDateTime);
    const aDateTime = '20' + ("0" + temp_aDateTime.getFullYear()).slice(-2) + '-' + ("0" + (temp_aDateTime.getMonth() + 1)).slice(-2) + '-' + ("0" + temp_aDateTime.getDate()).slice(-2) + 'T' +  ("0" + temp_aDateTime.getHours()).slice(-2) + ':' + ("0" + temp_aDateTime.getMinutes()).slice(-2) + ":" + ("0" + temp_aDateTime.getSeconds()).slice(-2) + '+05:30';


    contract.submitTransaction('Add_Transaction', ulpin, num, seller, buyer, reason, proposedPrice, tDateTime, officeCode, approvedBy, aDateTime).then((payload) => {
        res.status(200).json(JSON.parse(payload.toString()));
    }).catch((err) => {
        res.status(501).send(JSON.parse(err.toString()));
    });
});


router.get('/migrate', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    res.render("registrar/migrate", {currentUser: req.user})
});


module.exports = router;