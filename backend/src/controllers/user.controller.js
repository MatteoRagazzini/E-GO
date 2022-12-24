const config = require("../config/auth.config");
const db = require("../models");
const mongoose = require("mongoose");
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

    const newVehicle = new Vehicle({
        name: req.name,
        batteryLevel: 30,
        img: req.img,
        isCharging: false
    });

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

exports.addFavouriteStation = (req, res) => {
    User.findOneAndUpdate({_id: req.body.user_id},{$push: {'favouriteStations':
                req.body.station_id}}, {new: true}, function(err, user) {
            if (err)
                res.send(err);
            else{
                if(user==null){
                    res.status(404).send({
                        description: 'user not found'
                    });
                }
                else{
                    console.log("station successfully added to the user")
                    res.status(200).send("station successfully added to the user");
                }
            }
        });
}

exports.removeFavouriteStation = (req, res) => {
    User.findOneAndUpdate({_id: req.body.user_id},{$pull: {'favouriteStations':
            req.body.station_id}}, function(err, user) {
        if (err)
            res.send(err);
        else{
            if(user==null){
                res.status(404).send({
                    description: 'user not found'
                });
            }
            else{
                console.log("station successfully removed from the user")
                res.status(200).send("station successfully removed from the user");
            }
        }
    });
}

exports.getFavouriteStations = (req, res) => {

    User.findById(req.params.id, function(err, user) {
        if (err)
            res.send(err);
        else{
            if(user==null){
                res.status(404).send({
                    description: 'User not found'
                });
            }
            else{
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