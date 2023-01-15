const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        profilePicture: String,
        status: String,
        occupiedStationId:String,
        showOnlyFavourites: Boolean,
        favouriteStations : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Station"
            }
        ],
        vehicles : [{
            name: String,
            vehicleType: String,
            img: String,
            batteryLevel: Number,
            isCharging: Boolean,
            isCurrent: Boolean,
        }],
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);

module.exports = User;