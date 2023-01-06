const mongoose = require("mongoose");

const Charge = mongoose.model(
    "Charge",
    new mongoose.Schema({
        user_id: String,
        station_id: String,
        station_name: String,
        tower_id: String,
        vehicle_id: String,
        vehicle_name: String,
        isCompleted: Boolean,
        startDateTime: String,
        stopDateTime: String,
        duration: Number,
        totalBatteryCharged: Number,
        cost: Number
    })
);

module.exports = Charge;