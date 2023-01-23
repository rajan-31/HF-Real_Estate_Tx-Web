const mongoose = require("mongoose");

const estateSchema = new mongoose.Schema({
    ulpin: {
        type: String,
        unique: true
    },
    "owner": String,
    "officeCode": String,
    "location": String,
    "area": Number,
    "status": Number,
    "purchasedOn": String,
    "saleAvailability": Boolean,
    "beingSold": Boolean
});

module.exports = mongoose.model("Estate", estateSchema);