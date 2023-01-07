const db = require("../models");
const {authJwt} = require("../middlewares");
const controller = require("./charge.controller");
const Reservation = db.reservation;
const userController = require("../controllers/user.controller");
const stationController = require("../controllers/station.controller");


exports.createReservation = (req, res) => {

    console.log("[RESERVE] user: " + req.body.user.username, "| station: " + req.body.station.address)

    stationController.TowerOccupy(req.body.user._id, req.body.station._id)
        .then(tower=>{
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
            reservation.save().then(res.status(200).send(reservation))
        })
        .catch(err=>console.log(err))
};

exports.deleteReservation = (req, res) => {
    console.log("[DEL RESERVATION] user: " + req.body.user.username, "| station: " + req.body.station.address)
    Reservation.find({user_id : req.body.user._id}, function (err, reservations){
        if(err)console.log(err)
        else{
            const activeRes = reservations.find(r => r.isActive)
            if(activeRes === undefined)res.status(500).send("No active reservation found")
            // console.log(activeRes)
            else{
                activeRes.stopDateTime = new Date();
                activeRes.isActive = false;
                const difference =  activeRes.stopDateTime - activeRes.startDateTime
                const minutes = Math.round(difference / 60000); // minutes
                const diffDays = Math.floor(difference / 86400000); // days
                const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
                const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
                activeRes.duration = diffHrs + "h:" + diffMins + "m"
                activeRes.save()
                    .then(reservationSaved => stationController.TowerRelease(req.body.station._id, reservationSaved.tower_id))
                    .then(result => {
                        res.status(200).send("BOOKING CANCELED " + result)
                    }).catch(err=>{
                        res.status(500).send(err)
                })
            }
        }
    })

    // stationController.TowerRelease(req.body.user._id, req.body.station._id)
    //     .then(res=> Reservation.findById(req.body.reservation._id))
    //     .then(reservation => {
    //         console.log(reservation)
    //         // reservation.stopDateTime = new Date();
    //         // const difference =  reservation.stopDateTime - reservation.startDateTime
    //         // const minutes = Math.round(difference / 60000); // minutes
    //         // const diffDays = Math.floor(difference / 86400000); // days
    //         // const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
    //         // const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
    //         // reservation.duration = diffHrs + "h:" + diffMins + "m"
    //         // reservation.save().then(res.status(200).send(tower))
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // stationController.
    //     .then(res=> Reservation.findById(req.body.reservation._id))
    //     .then(reservation => {
    //         reservation.stopDateTime = new Date();
    //         const difference =  reservation.stopDateTime - reservation.startDateTime
    //         const minutes = Math.round(difference / 60000); // minutes
    //         const diffDays = Math.floor(difference / 86400000); // days
    //         const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
    //         const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
    //         reservation.duration = diffHrs + "h:" + diffMins + "m"
    //         reservation.save().then(res.status(200).send(tower))
    //     })
    //     .catch(err=>console.log(err))
};



exports.getReservation = (req, res) => {
    // if(req.body.constructor === Object && Object.keys(req.body).length === 0) res.status(500).send("Charge object is missing")
    // else{
    //     Charge.findById(req.body.charge._id).then( charge => {
    //             charge.isCompleted = true;
    //             charge.stopDateTime = new Date();
    //             const difference =  charge.stopDateTime - charge.startDateTime
    //             const minutes = Math.round(difference / 60000); // minutes
    //             const diffDays = Math.floor(difference / 86400000); // days
    //             const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
    //             const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
    //             charge.duration = diffHrs + "h:" + diffMins + "m"
    //             // to make with a sense
    //             charge.totalBatteryCharged = 100
    //             // considering a cost of 10 cents per minutes
    //             charge.cost = ( minutes * 0.10).toFixed(2)
    //
    //             console.log(charge)
    //
    //             charge.save()
    //                 .then(result =>stationController.releaseTowerForTimerExpired(req.body.charge.station_id, req.body.charge.tower_id))
    //                 .then(result => res.send(result))
    //                 .catch(err => res.status(500).send(err))
    //         }
    //     ).catch(err => {
    //         res.send(err)
    //     })
    // }
}