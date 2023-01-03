const db = require("../models");
const stationController = require("../controllers/station.controller")
const User = db.user;

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

function findUser(req) {
    return new Promise((resolve, reject) => {
        User.findById(req.body.user_id, function (err, user) {
            if (err)
                reject(err);
            else {
                if (user == null) reject("User not found")
                else resolve(user)
            }
        })
    })
}

function perfmormOperation(user, req, operation, vehicle = {}) {
    let vehicleToRemove = {}
    return new Promise((resolve, reject) => {
        if (operation === 'push') user.vehicles.push(vehicle);
        else if (operation === 'pull') {
            vehicleToRemove = user.vehicles.find(v => v._id = req.body.vehicle_id);
            if (vehicleToRemove == null) reject('vehicle not found')
            user.vehicles.splice(vehicleToRemove, 1)
        }
        else{
            reject('operation unknown')
        }
        user.save().then(
            resolve("operation performed")
        ).catch(error => {
                reject(error)
            }
        )
    })
}

exports.addVehicle = (req, res) => {

    const newVehicle = {
        name: req.body.name,
        vehicleType: req.body.vehicleType,
        icon: req.body.icon,
        batteryLevel: req.body.batteryLevel,
        isCharging: req.body.isCharging,
        isCurrent: req.body.isCurrent
    };

    findUser(req)
        .then(user => perfmormOperation(user, req, 'push', newVehicle))
        .then(result => res.status(200).send(result))
}

exports.updateVehicle = (req, res) => {
    User.findById(req.body.user_id, function (err, user) {
        if (err) {
            res.send(err)
        } else {
            if (user == null) {
                res.status(404).send({
                    description: 'user not found'
                });
            } else {
                const vehicle = user.vehicles.find(v => v._id = req.body.vehicle_id);
                if (vehicle == null) {
                    res.status(404).send({
                        description: 'vehicle not found'
                    });
                } else {

                    vehicle.name = req.body.name
                    vehicle.vehicleType = req.body.vehicleType
                    vehicle.icon = req.body.icon
                    vehicle.batteryLevel = req.body.batteryLevel
                    vehicle.isCharging = req.body.isCharging
                    vehicle.isCurrent = req.body.isCurrent

                    user.save().then(
                        res.status(200).send("vehicle successfully updated")
                    ).catch(e => {
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
                    ).catch(e => {
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

    findUser(req)
        .then(user => console.log(res))
        .catch(err => console.log(err))

    // User.findOneAndUpdate({_id: req.body.user_id}, {
    //     $push: {
    //         'favouriteStations':
    //         req.body.station_id
    //     }
    // }, {new: true}, function (err, user) {
    //     if (err)
    //         res.send(err);
    //     else {
    //         if (user == null) {
    //             res.status(404).send({
    //                 description: 'user not found'
    //             });
    //         } else {
    //             console.log("station successfully added to the user")
    //             res.status(200).send("station successfully added to the user");
    //         }
    //     }
    // });
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



