const db = require("../models");
const Reservation = db.reservation;
const userController = require("../controllers/user.controller");
const stationController = require("../controllers/station.controller");


exports.createReservation = (req, res) => {
    console.log("[RESERVE] user: " + req.body.user.username, "| station: " + req.body.station.address)
    userController.setStatus("reserved", req.body.user._id, req.body.station._id)
        .then(result => stationController.TowerOccupy(req.body.user._id, req.body.station._id))
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
                .catch(err => res.status(400).send(err))
        })
        .catch(err => res.status(400).send(err))
};


exports.deleteReservation = (req, res) => {
    if (req.params.user_id === null) res.status(400).send({message: "parameters not ready"})

    userController.setStatus("free", req.params.user_id, "")
        .then(r => {
                Reservation.find({user_id: req.params.user_id}, function (err, reservations) {
                    if (err) res.status(404).send({message: "No reservations found for the user"})
                    else {
                        const activeRes = reservations.find(r => r.isActive)
                        if (activeRes === undefined) res.status(404).send({message: "No active reservation found"})
                        else {
                            activeRes.stopDateTime = new Date();
                            activeRes.isActive = false;
                            const difference = activeRes.stopDateTime - activeRes.startDateTime

                            const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
                            const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes

                            activeRes.duration = diffHrs + "h:" + diffMins + "m"
                            activeRes.save()
                                .then(reservationSaved => stationController.TowerRelease(reservationSaved.station_id, reservationSaved.tower_id))
                                .then(result => {
                                    res.status(200).send(result)
                                }).catch(err => {
                                res.status(400).send(err)
                            })
                        }
                    }
                })
            }
        )
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

exports.deleteReservationPromise = (user_id) => {
    return new Promise((resolve, reject) => {
        // if(user_id === null) reject("parameters not ready")
        // // console.log("[DEL RESERVATION] user: " + user.username)
        // userController.setStatus("free", user_id, "")
        //     .then(r => {
        //             console.log("here")
        //             Reservation.find({user_id: user_id}, function (err, reservations) {
        //                 if (err) reject(err)
        //                 else {
        //                     const activeRes = reservations.find(r => r.isActive)
        //                     if (activeRes === undefined) reject("No active reservation found")
        //                     else {
        //                         activeRes.stopDateTime = new Date();
        //                         activeRes.isActive = false;
        //                         const difference = activeRes.stopDateTime - activeRes.startDateTime
        //                         const diffDays = Math.floor(difference / 86400000); // days
        //                         const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
        //                         const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
        //                         activeRes.duration = diffHrs + "h:" + diffMins + "m"
        //                         activeRes.save()
        //                             .then(reservationSaved => stationController.TowerRelease(reservationSaved.station_id.toString(), reservationSaved.tower_id.toString()))
        //                             .then(result => {
        //                                 resolve("BOOKING CANCELED " + result)
        //                             }).catch(err => {
        //                             reject(err)
        //                         })
        //                     }
        //                 }
        //             })
        //         }
        //     )
    })
}


// exports.getReservation = (req, res) => {
//
// }