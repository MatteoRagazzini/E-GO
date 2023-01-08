const mongoose = require("mongoose");

const Reservation = mongoose.model(
    "Reservation",
    new mongoose.Schema({
        user_id:String,
        station_id: String,
        tower_id: String,
        vehicle_id: String,
        isActive: Boolean,
        startDateTime: Date,
        stopDateTime: Date,
        duration: String,
    })
);

module.exports = Reservation;