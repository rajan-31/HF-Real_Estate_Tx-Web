const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true
    },
    stampDutyPaid: {
        type: Boolean,
        default: false
    },
    registrationChargesPaid: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Tax", taxSchema);