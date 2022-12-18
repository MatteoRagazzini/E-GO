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
        vehicles : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vehicle"
            }
        ],
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