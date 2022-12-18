const mongoose = require("mongoose");

const Station = mongoose.model(
    "Station",
    new mongoose.Schema({
        latitude: Number,
        longitude: Number,
        address: String,
        totalTowers: Number,
        usedTowers: Number,
        towers : [{
            id: Number,
            isAvailable: Boolean,
            charging_vehicle_id: String
        }],

    })
);

module.exports = Station;