const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        profilePicture: String,
        favouriteStations : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Station"
            }
        ],
        vehicles : [{
            name: String,
            vehicleType: String,
            icon: String,
            batteryLevel: Number,
            isCharging: Boolean,
            isCurrent: Boolean,
        }],
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ],
        chargeHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Charge"
            }
        ]
    })
);

module.exports = User;