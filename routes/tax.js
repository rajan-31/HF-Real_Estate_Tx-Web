const express = require("express");
const router = express.Router();
const path = require("path");

const allMiddlewares = require('../middlewares/index');

const Tax = require("../models/Tax");


router.get('/tax', allMiddlewares.isLoggedInUser, (req, res) => {
    const queryData = req.query;

    const _transactionId = queryData.transactionId;

    Tax.findOne({transactionId: _transactionId}, (err0, transaction0) => {
        const _isPaid = (transaction0.stampDutyPaid && transaction0.registrationChargesPaid) == true ? 1 : 0;
        res.render('tax/tax', {currentUser: req.user, serveyNo: queryData.serveyNo, transactionId: _transactionId, isPaid: _isPaid});
    });
});

router.post('/tax', allMiddlewares.isLoggedInUser, (req, res) => {
    const formData = req.body;

    const serveyNo = formData.serveyNo;

    const key = 'estate' + '_' + serveyNo;
    contract.submitTransaction('GetValue', key).then((payload) => {
        const estate_data = JSON.parse( payload.toString() );
        
        if(estate_data.beingSold == true) {
            const _transactionId = 'transaction' + '_' + serveyNo + '_' + String(estate_data.transactionsCount + 1);

            Tax.findOne({transactionId: _transactionId}, (err0, transaction0) => {
                if(err0) {
                    console.log(err0);
                    res.json({redirectURL: '/user'});
                } else {
                    if(transaction0) {
                        res.json({redirectURL: `/tax?serveyNo=${serveyNo}&transactionId=${_transactionId}`});
                    } else {
                        Tax.create({transactionId: _transactionId}, (err1, transaction1) => {
                            if(err1) {
                                console.log(err1);
                                res.json({redirectURL: '/user'});
                            } else {
                                res.json({redirectURL: `/tax?serveyNo=${serveyNo}&transactionId=${_transactionId}`});
                            }
                        });
                    }
                }
            });
        } else {
            res.json({redirectURL: '/user'});
        }

    }).catch((err) => {
        res.json({redirectURL: '/user'});
    });

});


router.post('/tax/pay', allMiddlewares.isLoggedInUser, (req, res) => {
    const formData = req.body;

    const serveyNo = formData.serveyNo;
    const _transactionId = formData.transactionId;

    console.log(formData)

    Tax.updateOne({transactionId: _transactionId}, {stampDutyPaid: true, registrationChargesPaid: true}, (err0, transaction0) => {
        if(err0) {
            console.log(err0);
        }
        console.log(transaction0);
        res.json({redirectURL: '/user'});

    });
});

router.get('/tax/check', allMiddlewares.isLoggedInRegistrar, (req, res) => {
    const queryData = req.query;

    const _transactionId = queryData.transactionId;

    Tax.findOne({transactionId: _transactionId}, (err0, transaction0) => {
        if(err0) {
            console.log(err0)
            res.status(502);
        } else if (transaction0){
            const _isPaid = (transaction0.stampDutyPaid && transaction0.registrationChargesPaid) == true ? 1 : 0;
            if(_isPaid == 1) {
                res.json({isPaid: true});
            } else {
                res.json({isPaid: false});
            }
        } else {
            res.status(503).send("No record");
        }
    });
});


module.exports = router;