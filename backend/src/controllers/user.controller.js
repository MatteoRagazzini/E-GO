const config = require("../config/auth.config");
const db = require("../models");
const mongoose = require("mongoose");
const stationController = require("../controllers/station.controller")
const User = db.user;
const Role = db.role;
const Vehicle = db.vehicle;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

exports.addVehicle = (req, res) => {

    const newVehicle = {
        name: req.body.name,
        vehicleType: req.body.vehicleType,
        icon: req.body.icon,
        batteryLevel: req.body.batteryLevel,
        isCharging: req.body.isCharging,
        isCurrent: req.body.isCurrent
    };

    User.findOneAndUpdate({_id: req.body.user_id}, {
        $push: {
            'vehicles':
            newVehicle
        }
    }, {new: true}, function (err, user) {
        if (err)
            res.send(err);
        else {
            if (user == null) {
                res.status(404).send({
                    description: 'user not found'
                });
            } else {
                res.status(200).send("vehicle successfully added to the user");
            }
        }
    });
}

exports.removeVehicle = (req, res) => {
    User.findById(req.body.user_id, function (err, user) {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            if (user == null) {
                res.status(404).send({
                    description: 'user not found'
                });
            } else {
                const index = user.vehicles.find(v => v._id = req.body.vehicle_id);
                if (index == null) {
                    res.status(404).send({
                        description: 'vehicle not found'
                    });
                } else {
                    user.vehicles.splice(index, 1)
                    user.save().then(
                        res.status(200).send("vehicle successfully removed")
                    ).catch(e=>{
                            res.status(404).send({
                                description: 'save not completed'
                            });
                    }
                    )

                }
            }
        }
    });
}

exports.addFavouriteStation = (req, res) => {
    User.findOneAndUpdate({_id: req.body.user_id}, {
        $push: {
            'favouriteStations':
            req.body.station_id
        }
    }, {new: true}, function (err, user) {
        if (err)
            res.send(err);
        else {
            if (user == null) {
                res.status(404).send({
                    description: 'user not found'
                });
            } else {
                console.log("station successfully added to the user")
                res.status(200).send("station successfully added to the user");
            }
        }
    });
}

exports.removeFavouriteStation = (req, res) => {
    User.findOneAndUpdate({_id: req.body.user_id}, {
        $pull: {
            'favouriteStations': req.body.station_id
        }
    }, function (err, user) {
        if (err)
            res.send(err);
        else {
            if (user == null) {
                res.status(404).send({
                    description: 'user not found'
                });
            } else {
                console.log("station successfully removed from the user")
                res.status(200).send("station successfully removed from the user");
            }
        }
    });
}

exports.getVehicles = (req, res) => {

    User.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        else {
            if (user == null) {
                res.status(404).send({
                    description: 'User not found'
                });
            } else {
                res.json(user.vehicles);
            }
        }
    });
}

exports.getFavouriteStations = (req, res) => {

    User.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        else {
            if (user == null) {
                res.status(404).send({
                    description: 'User not found'
                });
            } else {
                res.json(user.favouriteStations);
            }
        }
    });

    //
    // User.findOne({_id: req.params.user_id}, function(err, user) {
    //     if (err)
    //         res.send(err);
    //     else{
    //         if(user==null){
    //             res.status(404).send({
    //                 description: 'user not found'
    //             });
    //         }
    //         else{
    //             res.status(200).json(user.favouriteStations());
    //         }
    //     }
    // });
}

exports.connect = (req, res) => {
    User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.send(err);
        else {
            if (user == null) {
                res.status(404).send({
                    description: 'User not found'
                });
            } else {
                const currentVehicle = user.vehicles.find(v => v.isCurrent)
                stationController.occupyTower()
            }
        }
    });
}