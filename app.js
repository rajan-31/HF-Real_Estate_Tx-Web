const express = require("express");
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const expressSession = require("express-session");
const mongoose = require("mongoose")
const connectMongo = require("connect-mongo");
const flash = require('connect-flash');

const path = require("path")
const fs = require('fs');

const app = express();


require('dotenv').config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use("/", express.static(path.join(__dirname, "public"), {
    etag: false,
    maxAge: 1000 * 60 * 60   // 1 hr
}));

const mongodbURL = process.env.MONGODB_URL;
mongoose.connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + mongodbURL);
}).on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
}).on('disconnected', function () {
    console.log('Mongoose connection lost!');
});


const sessionMiddleware = expressSession({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 * 1 * 1,   //1hour
        sameSite: "lax",
        // secure: true,   // set only when using https
        httpOnly: true
    },
    store: connectMongo.create({ mongoUrl: process.env.MONGODB_URL })
});


app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());


//=====================================

contract = null;

const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');

const connectionSetup = async () => {
    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, "configs", "identity/user/User1@org1.example.com/wallet"));
    const gateway = new Gateway();

    try {
        const userName = 'User1@org1.example.com';
        let connectionProfile = yaml.load(fs.readFileSync(path.join(__dirname, "configs", "connection-org1.yaml"), 'utf8'));
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }
        };

        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        const network = await gateway.getNetwork('channel1');
        contract = await network.getContract('simplecc');

        // const listener = async (event) => {
        //     if (event.eventName === 'newEstateSell') {
        //         const details = event.payload.toString('utf8');
        //         console.log(details);
        //     }
        // };
        
        // await contract.addContractListener(listener);   // {startBlock: 0}

        console.log("Connection to Fabric gateway is set :)");
    } catch (error) {

        console.log(`Error creating Gateway: ${error}`);
        console.log(error.stack);

    }
}

connectionSetup();

//=====================================


passport.use('user', new LocalStrategy(function (uid, password, done) {
    const key = 'user' + '_' + uid;
    contract.submitTransaction('GetValue', key).then((payload) => {
        const user = JSON.parse(payload.toString());

        if (!user) { return done(null, false); }
        if (!user.password === password) { return done(null, false); }

        const toPass = {
            uid: user.uid,
            name: user.name,
            type: 'user',
            status: user.status
        }
        return done(null, toPass);

    }).catch((err) => {
        return done(err);
    });
}));

passport.use('registrar', new LocalStrategy(function (officeCode, password, done) {
    const key = 'admin' + '_' + officeCode;
    contract.submitTransaction('GetValue', key).then((payload) => {
        const registrar = JSON.parse(payload.toString());

        if (!registrar) { return done(null, false); }
        if (!registrar.password === password) { return done(null, false); }

        const toPass = {
            officeCode: officeCode,
            name: registrar.name,
            type: 'registrar'
        }
        return done(null, toPass);

    }).catch((err) => {
        return done(err);
    });
}));

passport.use('igr', new LocalStrategy(function (username, password, done) {
    if(username.indexOf("super") == -1 ) { return done("Not a IGR!"); }

    const key = 'admin' + '_' + username;
    contract.submitTransaction('GetValue', key).then((payload) => {
        const igr = JSON.parse(payload.toString());

        if (!igr) { return done(null, false); }
        if (!igr.password === password) { return done(null, false); }

        const toPass = {
            id: username,
            name: igr.name,
            type: 'igr'
        }
        return done(null, toPass);

    }).catch((err) => {
        return done(err);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    if (user != null) done(null, user);
});

app.use(function(req, res, next){
    res.locals.loggedInUser = req.user;
    res.locals.successMessage = req.flash("successMessage");
    res.locals.errorMessage = req.flash("errorMessage");

    next();
});


const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const registrarRoutes = require("./routes/registrar");
const igrRoutes = require("./routes/igr");
const taxRoutes = require("./routes/tax");
app.use(indexRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(registrarRoutes);
app.use(igrRoutes);
app.use(taxRoutes);

app.get('/*', (req, res) => {
    res.status(404).send(`<div style="text-align:center;"><h1>Error 404</h1><h3>You are lost!</h3><a href="/">Go Home</a></div>`);
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});