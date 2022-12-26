const mongoose = require("mongoose");

const Vehicle = mongoose.model(
    "Vehicle",
    new mongoose.Schema({
        name: String,
        img: String,
        batteryLevel: Number,
        isCharging: Boolean,
        isCurrent: Boolean,
    })
);

module.exports = Vehicle;