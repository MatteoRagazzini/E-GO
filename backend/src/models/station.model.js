const mongoose = require("mongoose");

const Station = mongoose.model(
    "Station",
    new mongoose.Schema({
        latitude: {
            type: Number,
            required: true
        },
        longitude:  {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        totalTowers: {
            type: Number,
            required: true
        },
        usedTowers: {
            type: Number,
            required: true
        },
        towers : [{
            id: Number,
            isAvailable: Boolean,
            charging_vehicle_id: String
        }],

    })
);

module.exports = Station;