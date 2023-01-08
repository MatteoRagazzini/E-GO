const db = require("../models");
const {authJwt} = require("../middlewares");
const controller = require("./charge.controller");
const Reservation = db.reservation;
const userController = require("../controllers/user.controller");
const stationController = require("../controllers/station.controller");


exports.createReservation = (req, res) => {

    console.log("[RESERVE] user: " + req.body.user.username, "| station: " + req.body.station.address)
    userController.setStatus("reserved",req.body.user._id, req.body.station._id)
        .then(result => stationController.TowerOccupy(req.body.user._id, req.body.station._id)
            .then(tower => {
                const reservation = new Reservation({
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
                    .catch(err => res.status(500).send(err))
            })
            .catch(err => res.status(500).send(err))
        )
};



exports.deleteReservation = (req, res) => {
this.deleteReservationPromise(req.body.user)
    .then(result => res.status(200).send(result))
    .catch(error => res.status(500).send(error))
}

// exports.deleteReservation = (req, res) => {
//     console.log("[DEL RESERVATION] user: " + req.body.user.username)
//     userController.setStatus("free", req.body.user._id, "")
//         .then(r => {
//             console.log("here")
//             Reservation.find({user_id: req.body.user._id}, function (err, reservations) {
//                     if (err) console.log(err)
//                     else {
//                         const activeRes = reservations.find(r => r.isActive)
//                         if (activeRes === undefined) res.status(500).send("No active reservation found")
//                         // console.log(activeRes)
//                         else {
//                             activeRes.stopDateTime = new Date();
//                             activeRes.isActive = false;
//                             const difference = activeRes.stopDateTime - activeRes.startDateTime
//                             const minutes = Math.round(difference / 60000); // minutes
//                             const diffDays = Math.floor(difference / 86400000); // days
//                             const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
//                             const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
//                             activeRes.duration = diffHrs + "h:" + diffMins + "m"
//                             activeRes.save()
//                                 .then(reservationSaved => stationController.TowerRelease(reservationSaved.station_id.toString(), reservationSaved.tower_id.toString()))
//                                 .then(result => {
//                                     res.status(200).send("BOOKING CANCELED " + result)
//                                 }).catch(err => {
//                                 res.status(500).send(err)
//                             })
//                         }
//                     }
//                 })
//             }
//         )
// };

exports.deleteReservationPromise = (user) => {
    console.log("[DEL RESERVATION] user: " + user.username)
    return new Promise((resolve, reject) => {
        userController.setStatus("free", user._id, "")
            .then(r => {
                    console.log("here")
                    Reservation.find({user_id: user._id}, function (err, reservations) {
                        if (err) reject(err)
                        else {
                            const activeRes = reservations.find(r => r.isActive)
                            if (activeRes === undefined) reject("No active reservation found")
                            else {
                                activeRes.stopDateTime = new Date();
                                activeRes.isActive = false;
                                const difference = activeRes.stopDateTime - activeRes.startDateTime
                                const diffDays = Math.floor(difference / 86400000); // days
                                const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
                                const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
                                activeRes.duration = diffHrs + "h:" + diffMins + "m"
                                activeRes.save()
                                    .then(reservationSaved => stationController.TowerRelease(reservationSaved.station_id.toString(), reservationSaved.tower_id.toString()))
                                    .then(result => {
                                        resolve("BOOKING CANCELED " + result)
                                    }).catch(err => {
                                    reject(err)
                                })
                            }
                        }
                    })
                }
            )
    })
}



exports.getReservation = (req, res) => {

}