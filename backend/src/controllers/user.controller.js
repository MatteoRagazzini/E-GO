const db = require("../models");
const stationController = require("../controllers/station.controller")
const User = db.user;


function queryCallbackWithError(res, err, queryResult, notFoundCond) {
    if (err)
        res.send(err);
    else {
        if (notFoundCond)
            res.status(404).send({message: "User not found"});
        else {
            res.json(queryResult);
        }
    }
}

function queryCallback(res, err, booking) {
    queryCallbackWithError(res, err, booking, false);
}


exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, req.body, {new: true},
        (err, r) => queryCallbackWithError(res, err, r, r == null))
};

// exports.setShowOnlyFavourites = (req, res) => {
//     this.findUser(req.body.user_id)
//         .then(user => {
//             console.log(user)
//             user.showOnlyFavourites = req.body.showOnlyFavourites
//             user.save()
//         }).catch(err => reject(err))
//         .then(result => res.status(200).send(result))
//         .catch(err => res.status(400).send(err))
// }

//HELPER FUNCTIONS//

exports.findUser = (user_id) => {
    return new Promise((resolve, reject) => {
        User.findById(user_id, function (err, user) {
            if (err)
                reject(err);
            else {
                if (user === null) reject("User not found")
                else resolve(user)
            }
        })
    })
};

// exports.setStatus = (status, user_id, station_id) => {
//     return new Promise((resolve, reject) => {
//         this.findUser(user_id).then(user => {
//             user.status = status
//             user.occupiedStationId = station_id
//             user.save()
//                 .then(resolve("status updated to " + status))
//                 .catch(reject("problem in saving"))
//         }).catch(err => reject(err))
//     })
// }

function performOperationVehicle(user, req, operation, NewVehicle = {}) {
    return new Promise((resolve, reject) => {
        if (operation === 'push') user.vehicles.push(NewVehicle);
        else if (operation === 'pull') {
            // NOTE: FOR VEHICLES WE SHOULD USE ID AND NOT _ID
            let index = user.vehicles.findIndex(v => v.id === req.params.vehicle_id);
            if (index === -1) reject('vehicle not found')
            user.vehicles.splice(index, 1)
        } else if (operation === 'update') {
            const vehicle = user.vehicles.find(v => v.id === req.params.vehicle_id);
            if (vehicle === undefined) {
                reject('vehicle not found')
            } else {
                
                user.vehicles.forEach(v=>v.isCurrent=false);

                vehicle.name = req.body.vehicle.name
                vehicle.vehicleType = req.body.vehicle.vehicleType
                vehicle.img = req.body.vehicle.img
                vehicle.batteryLevel = req.body.vehicle.batteryLevel
                vehicle.isCharging = req.body.vehicle.isCharging
                vehicle.isCurrent = req.body.vehicle.isCurrent
            }
        } else {
            reject('operation unknown')
        }
        user.save().then(res =>
            resolve(res)
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
            let index = user.favouriteStations.findIndex(s => s._id.toString() === req.params.station_id);
            if (index === -1) reject('station not found')
            user.favouriteStations.splice(index, 1)
        } else {
            reject('operation unknown')
        }
        user.save().then(
            result => resolve(result)
        ).catch(error => {
                console.log(error)
                reject(error)
            }
        )
    })
}

// VEHICLES //

exports.addVehicle = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => performOperationVehicle(user, req, 'push', req.body.vehicle))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err))
}

exports.deleteVehicle = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => performOperationVehicle(user, req, 'pull'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err))
}

exports.updateVehicle = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => performOperationVehicle(user, req, 'update'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err))
}

// exports.updateVehicle = (req, res) => {
//     User.findOneAndUpdate({"vehicles._id":req.params.vehicle_id},{$set: {"product.$": req.body.vehicle}})
//         .then(result => {
//             console.log(result)
//             res.status(200).send(result)
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(400).send(err)
//         })
// }



// exports.setVehicleInUse = (req, res) => {
//     this.findUser(req.body.user_id)
//         // to fix the fact that multiple vehicles were Current together
//         .then(function (user) {
//             user.vehicles.forEach(v => v.isCurrent = false);
//             return user
//         })
//         .then(user => performOperationVehicle(user, req, 'update'))
//         .then(result => res.status(200).send(result))
//         .catch(err => res.status(400).send(err))
// }

// --DONE
exports.getVehicles = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => res.status(200).json(user.vehicles))
        .catch(err => res.status(400).send(err))
}

// // --DONE
// exports.getVehicle = (req, res) => {
//     this.findUser(req.params.user_id)
//         .then(function (user) {
//             const vehicle = user.vehicles.find(v => req.params.vehicle_id)
//             res.status(200).json(vehicle)
//         })
//         .catch(err => res.status(400).send(err))
// }

// STATIONS //

exports.addFavouriteStation = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => {
            if (user.favouriteStations.includes(req.body.station_id)) res.status(400).send({message: "station already between favourites"})
            else {
                performOperationFavourites(user, req, 'push', req.body.station_id)
                    .then(result => res.status(200).send(result))
                    .catch(err => res.status(400).send(err))
            }
        })
        .catch(err => res.status(400).send(err))
}

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


exports.deleteFavouriteStation = (req, res) => {

    this.findUser(req.params.user_id)
        .then(user => performOperationFavourites(user, req, 'pull'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err))

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
    this.findUser(req.params.user_id)
        .then(user => res.status(200).json(user.favouriteStations))
        .catch(err => res.status(400).send(err))

}

exports.getState = (req, res) => {
    User.findById(req.params.user_id,
        (err, r) => queryCallbackWithError(res, err, r, r == null))

}


// exports.connect = (req, res) => {
//     User.findById(req.params.user_id, function (err, user) {
//         if (err)
//             res.send(err);
//         else {
//             if (user == null) {
//                 res.status(404).send({
//                     description: 'User not found'
//                 });
//             } else {
//                 const currentVehicle = user.vehicles.find(v => v.isCurrent)
//                 stationController.occupyTower()
//             }
//         }
//     });
// }
//
// // we need to pass true or false based on if it's charging or not.
// exports.setIsCharging = (user_id, isCharging) => {
//     return new Promise((resolve, reject) => {
//         this.findUser(user_id)
//             .then(user => {
//                 user.isChargingAVehicle = isCharging;
//                 user.save().then(
//                     resolve(user)
//                 ).catch(error => {
//                         reject(error)
//                     }
//                 )
//             }).catch(err => {
//             console.log(err)
//         })
//     })
// }




