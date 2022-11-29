const mongoose = require("mongoose");

const Station = mongoose.model(
    "Station",
    new mongoose.Schema({
        latitude: Number,
        longitude: Number,
        maxSpaces: Number,
        usedSpaces: Number
        // connectedVehicles: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Vehicles"
        //     }
        // ]
    })
);

module.exports = Station;