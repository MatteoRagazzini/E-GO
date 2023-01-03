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

function performOperation(user, req, operation, NewVehicle = {}) {
    return new Promise((resolve, reject) => {
        if (operation === 'push') user.vehicles.push(NewVehicle);
        else if (operation === 'pull') {
            // NOTE: FOR VEHICLES WE SHOULD USE ID AND NOT _ID
            let index = user.vehicles.findIndex(v => v.id === req.body.vehicle_id);
            if (index === -1) reject('vehicle not found')
            user.vehicles.splice(index, 1)
        }else if (operation === 'update') {
            const vehicle = user.vehicles.find(v => v.id === req.body.vehicle_id);
            console.log(vehicle)
            if (vehicle === undefined) {
                reject('vehicle not found')
            } else {
                vehicle.name = req.body.name
                vehicle.vehicleType = req.body.vehicleType
                vehicle.img = req.body.img
                vehicle.batteryLevel = req.body.batteryLevel
                vehicle.isCharging = req.body.isCharging
                vehicle.isCurrent = req.body.isCurrent
            }
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
        .then(user => performOperation(user, req, 'push', newVehicle))
        .then(result => res.status(200).send(result))
}

exports.removeVehicle = (req, res) => {
    findUser(req)
        .then(user => performOperation(user, req, 'pull'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
}


exports.updateVehicle = (req, res) => {
    findUser(req)
        .then(user => performOperation(user, req, 'update'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
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



