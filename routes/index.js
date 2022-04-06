const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
    res.render("home");
});

router.get('/test', (req, res) => {
    res.render("test");
});


router.get('/all-data', (req, res)=>{
    contract.evaluateTransaction('GetAll', '', '').then((payload) => {
        res.status(200).json( JSON.parse( payload.toString() ) );
    }).catch((err) => {
        res.status(501).send(err);
    });
});


router.post('/delete-value', (req, res) => {
    contract.submitTransaction('DeleteValue', req.body.key).then((payload) => {
        res.status(200).send('OK');
    }).catch((err) => {
        res.status(501).send(err);
    });
});

router.post('/execute-any', (req, res) => {
    const formData = req.body;
    const func = formData.func;
    const args = JSON.parse(formData.args);

    contract.submitTransaction(func, ...args).then((payload) => {
        if (!payload)
            res.status(200).json( JSON.parse( payload.toString() ) );
        else
        res.status(200).send('OK');
    }).catch((err) => {
        res.status(501).send(err);
    });
});

router.get('/details/estate', (req, res) => {
    const queryData = req.query;
    const ulpin = queryData.ulpin;

    const key = "estate" + '_' + ulpin;

    contract.evaluateTransaction('GetValue', key).then(async (payload) => {
        const estate = JSON.parse( payload.toString() );
        res.status(200).json(estate);
    }).catch((err) => {
        res.status(501).send(err);
    });
});

router.get('/details/transaction', (req, res) => {
    const queryData = req.query;

    const ulpin = queryData.ulpin;
    const transactionNum = queryData.transactionNum;

    const key = "transaction" + '_' + ulpin + '_' + transactionNum;

    contract.evaluateTransaction('GetValue', key).then(async (payload) => {
        const transaction = JSON.parse( payload.toString() );
        res.status(200).json(transaction);
    }).catch((err) => {
        res.status(501).send(err);
    });
});

router.get('/details/user', (req, res) => {
    const queryData = req.query;

    const uid = queryData.uid;
    
    const key = "user" + '_' + uid;
    contract.evaluateTransaction('GetValue', key).then(async (payload) => {
        const _user = JSON.parse( payload.toString() );
        res.status(200).json(_user);
    }).catch((err) => {
        res.status(501).send(err);
    });
});


module.exports = router;