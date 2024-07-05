const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    street : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    state : {
        type: String,
        required: true
    },
    country : {
        type: String,
        required: true
    },
    pincode : {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("Location", locationSchema);