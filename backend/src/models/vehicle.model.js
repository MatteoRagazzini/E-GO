const mongoose = require("mongoose");

const Vehicle = mongoose.model(
    "Vehicle",
    new mongoose.Schema({
        name: String,
        batteryLevel: Number,
        isCharging: Boolean,
    })
);

module.exports = Vehicle;