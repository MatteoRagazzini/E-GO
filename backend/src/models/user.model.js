const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profilePicture: String,
        status: {
            type: String,
            enum: ["FREE", "RESERVED", "CONNECTED"],
            default: "FREE"
        },
        occupiedStationId:String,
        showOnlyFavourites: {
            type: Boolean,
            default: false
        },
        vehicles : [{
            name: String,
            vehicleType: String,
            img: String,
            batteryLevel: Number,
            isCharging: Boolean,
            isCurrent: Boolean,
        }],
        favouriteStations : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Station"
            }
        ],
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);

module.exports = User;