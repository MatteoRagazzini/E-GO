const db = require("../models");
const User = db.user;


exports.getState = (req, res) => {
    User.findById(req.params.user_id,
        (err, r) => queryCallbackWithError(res, err, r, r == null))

}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, req.body, {new: true},
        (err, r) => queryCallbackWithError(res, err, r, r == null))
};


exports.getVehicles = (req, res) => {
    User.findById(req.params.user_id,
        (err, r) => queryCallback(res, err, r.vehicles,))
}

exports.addVehicle = (req, res) => {
    console.log(req.body.vehicle)
    User.updateOne({_id:req.params.user_id}, {$push: {vehicles: req.body}}, {new: true},
        (err, r) => queryCallbackWithError(res, err, r, r == null))
};

exports.updateVehicle = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => performOperationVehicle(user, req, 'update'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send({message: err}))
}

exports.deleteVehicle = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => performOperationVehicle(user, req, 'pull'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send({message: err}))
}


exports.getFavouriteStations = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => res.status(200).json(user.favouriteStations))
        .catch(err => res.status(400).send({message: err}))
}


exports.addFavouriteStation = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => {
            if (user.favouriteStations.includes(req.body.station_id)) res.status(400).send({message: "station already between favourites"})
            else {
                performOperationFavourites(user, req, 'push', req.body.station_id)
                    .then(result => res.status(200).send(result))
                    .catch(err => res.status(400).send({message: err}))
            }
        })
        .catch(err => res.status(400).send({message: err}))
}


exports.deleteFavouriteStation = (req, res) => {
    this.findUser(req.params.user_id)
        .then(user => performOperationFavourites(user, req, 'pull'))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send({message: err}))
}



exports.findUser = (user_id) => {
    return new Promise((resolve, reject) => {
        User.findById(user_id, function (err, user) {
            if (err)
                reject({message:err});
            else {
                if (user === null) reject({message:"User not found"})
                else resolve(user)
            }
        })
    })
};

exports.setStatus = (status, user_id, station_id) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(user_id, {status: status, occupiedStationId: station_id}, {new: true},
            (err, r) => {
                if (err) reject({message:err})
                else resolve(r)
            })
    })

}

function performOperationVehicle(user, req, operation, NewVehicle = {}) {
    return new Promise((resolve, reject) => {
        if (operation === 'push') user.vehicles.push(NewVehicle);
        else if (operation === 'pull') {
            let index = user.vehicles.findIndex(v => v.id === req.params.vehicle_id);
            if (index === -1) reject('vehicle not found')
            user.vehicles.splice(index, 1)
        } else if (operation === 'update') {
            const vehicle = user.vehicles.find(v => v.id === req.params.vehicle_id);
            if (vehicle === undefined) {
                reject('vehicle not found')
            } else {

                user.vehicles.forEach(v => v.isCurrent = false);

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
                 reject({message:err})
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
                 reject({message:err})
            }
        )
    })
}

function queryCallbackWithError(res, err, queryResult, notFoundCond) {
    if (err)
        res.send({message: err});
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




