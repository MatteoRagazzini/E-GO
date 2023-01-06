const mongoose = require("mongoose");

const Reservation = mongoose.model(
    "Reservation",
    new mongoose.Schema({
        user_id:String,
        station_id: String,
        tower_id: String,
        vehicle_id: String,
        startDateTime: String,
        stopDateTime: String,
        duration: Number,
    })
);

module.exports = Reservation;