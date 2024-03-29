const db = require("../models");
const Reservation = db.reservation;
const userController = require("../controllers/user.controller");
const stationController = require("../controllers/station.controller");


exports.createReservation = (req, res) => {
    let reservation;
    stationController.occupyTower(req.body.user._id, req.body.station._id)
        .then(tower => {
            userController.setStatus("RESERVED", req.body.user._id, req.body.station._id).then(user => {
                reservation = new Reservation({
                    user_id: req.body.user._id,
                    station_id: req.body.station._id,
                    tower_id: tower.id,
                    vehicle_id: tower.charging_vehicle_id,
                    isActive: true,
                    startDateTime: new Date(),
                    stopDateTime: null,
                    duration: null,
                });
                reservation.save()
                    .then(res.status(200).send(reservation))
                    .catch(err => res.status(400).send({message: err}))
            }).catch(err => res.status(400).send({message: err}))
        }).catch(err => res.status(400).send({message: err}))
};


exports.deleteReservation = (req, res) => {
    this.deleteReservationPromise(req.params.user_id)
        .then(result => res.status(200).send(result))
        .catch(error => {
            res.status(400).send({message: error.message})
        })
}


exports.deleteReservationPromise = (user_id) => {
    return new Promise((resolve, reject) => {
        if (user_id === null) reject({message: "parameters not ready"})

        userController.setStatus("FREE", user_id, "")
            .then(r => {
                Reservation.find({user_id: user_id}, function (err, reservations) {
                    if (err) reject({message: "No reservations found for the user"})
                    else {
                        const activeRes = reservations.find(r => r.isActive)
                        if (activeRes === undefined) reject({message: "No active reservation found"})
                        else {
                            activeRes.stopDateTime = new Date();
                            activeRes.isActive = false;
                            const difference = activeRes.stopDateTime - activeRes.startDateTime

                            const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
                            const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes

                            activeRes.duration = diffHrs + "h:" + diffMins + "m"
                            activeRes.save()
                                .then(reservationSaved => stationController.releaseTower(reservationSaved.station_id, reservationSaved.tower_id))
                                .then(result => {
                                    resolve(result)
                                }).catch(err => {
                                reject(err)
                            })
                        }
                    }
                })
            }).catch(err => reject(err))
    })
}

