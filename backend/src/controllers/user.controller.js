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

//HELPER FUNCTIONS//

exports.findUser = (user_id) => {
    return new Promise((resolve, reject) => {
        User.findById(user_id, function (err, user) {
            if (err)
                reject(err);
            else {
                if (user == null) reject("User not found")
                else resolve(user)
            }
        })
    })
};

exports.setStatus = (status, user_id, station_id) => {
    return new Promise((resolve, reject) => {
       this.findUser(user_id).then(user=>{
           user.status = status
           user.occupiedStationId = station_id
           user.save()
               .then(resolve("status updated to" + status ))
               .catch(reject("problem in saving"))
       }).catch(err=>reject(err))
    })
}

function performOperationVehicle(user, req, operation, NewVehicle = {}) {
    return new Promise((resolve, reject) => {
        if (operation === 'push') user.vehicles.push(NewVehicle);
        else if (operation === 'pull') {
            // NOTE: FOR VEHICLES WE SHOULD USE ID AND NOT _ID
            let index = user.vehicles.findIndex(v => v.id === req.body.vehicle_id);
            if (index === -1) reject('vehicle not found')
            user.vehicles.splice(index, 1)
        } else if (operation === 'update') {
            const vehicle = user.vehicles.find(v => v.id === req.body.vehicle_id);
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
        } else {
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

function performOperationFavourites(user, req, operation, newStation = {}) {
    return new Promise((resolve, reject) => {
        if (operation === 'push') user.favouriteStations.push(newStation);
        else if (operation === 'pull') {
            let index = user.favouriteStations.findIndex(s => s._id.toString() === req.body.station_id);
            if (index === -1) reject('station not found')
            user.favouriteStations.splice(index, 1)
        } else {
            reject('operation unknown')
        }
        user.save().then(
            resolve("operation performed")
        ).catch(error => {
                console.log(error)
                reject(error)
            }
        )
    })
}

// VEHICLES //

exports.addVehicle = (req, res) => {

    const newVehicle = {
        name: req.body.name,
        vehicleType: req.body.vehicleType,
        img: req.body.img,
        batteryLevel: req.body.batteryLevel,
        isCharging: req.body.isCharging,
        isCurrent: req.body.isCurrent
    };

    this.findUser(req.body.user_id)
        .then(user => performOperationVehicle(user, req, 'push', newVehicle))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
}

exports.removeVehicle = (req, res) => {
    this.findUser(req.body.user_id)
        .then(user => performOperationVehicle(user, req, 'pull'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
}

exports.updateVehicle = (req, res) => {
    this.findUser(req.body.user_id)
        .then(user => performOperationVehicle(user, req, 'update'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
}

exports.setVehicleInUse = (req, res) => {
    this.findUser(req.body.user_id)
        // to fix the fact that multiple vehicles were Current together
        .then(function (user) {
            user.vehicles.forEach(v => v.isCurrent = false);
            return user
        })
        .then(user => performOperationVehicle(user, req, 'update'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
}

exports.getVehicles = (req, res) => {
    this.findUser(req.params.id)
        .then(user => res.status(200).json(user.vehicles))
        .catch(err => res.status(500).send(err))
}

exports.getVehicle = (req, res) => {
    this.findUser(req.params.idUser)
        .then(function(user) {
            const vehicle = user.vehicles.find(v => req.params.idVehicle)
            res.status(200).json(vehicle)
        })
        .catch(err => res.status(500).send(err))
}

// STATIONS //

exports.addFavouriteStation = (req, res) => {

    this.findUser(req.body.user_id)
        .then(user => performOperationFavourites(user, req, 'push', req.body.station_id))
        .then(result => res.status(200).send(result))
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

    this.findUser(req.body.user_id)
        .then(user => performOperationFavourites(user, req, 'pull'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))

    // User.findOneAndUpdate({_id: req.body.user_id}, {
    //     $pull: {
    //         'favouriteStations': req.body.station_id
    //     }
    // }, function (err, user) {
    //     if (err)
    //         res.send(err);
    //     else {
    //         if (user == null) {
    //             res.status(404).send({
    //                 description: 'user not found'
    //             });
    //         } else {
    //             console.log("station successfully removed from the user")
    //             res.status(200).send("station successfully removed from the user");
    //         }
    //     }
    // });
}

exports.getFavouriteStations = (req, res) => {
    this.findUser(req.params.id)
        .then(user => res.status(200).json(user.favouriteStations))
        .catch(err => res.status(500).send(err))

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

// we need to pass true or false based on if it's charging or not.
exports.setIsCharging = (user_id, isCharging) => {
    return new Promise((resolve, reject) => {
        this.findUser(user_id)
            .then(user => {
                user.isChargingAVehicle = isCharging;
                user.save().then(
                    resolve(user)
                ).catch(error => {
                        reject(error)
                    }
                )
            }).catch(err => {
            console.log(err)
        })
    })
}




