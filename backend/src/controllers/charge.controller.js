const db = require("../models");
const Charge = db.charge;
const stationController = require("../controllers/station.controller");
const userController = require("../controllers/user.controller");
const User = db.user;

function findUser(user_id) {
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
}


exports.startCharge = (req, res) => {
    findUser(req.body.user._id).then(user => {
        const currVehicle = user.vehicles.find(v => v.isCurrent);
        const charge = new Charge({
            user_id: req.body.user._id,
            station_id: req.body.station._id,
            station_name: req.body.station.address,
            tower_id: req.body.tower_id,
            vehicle_id: currVehicle.id,
            vehicle_name: currVehicle.name,
            isCompleted: false,
            startDateTime: new Date(),
            stopDateTime: null,
            duration: null,
            totalBatteryCharged: null,
            cost: null
        });

        userController.setStatus("connected", req.body.user._id, req.body.station._id)
            .then(r =>
                charge.save(err => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }
                    res.status(200).send({message: "Charge was registered successfully!"});
                })
            )
    })
};


// exports.endCharge = (req, res) => {
//     if(req.body.constructor === Object && Object.keys(req.body).length === 0) res.status(500).send("Charge object is missing")
//     else{
//         Charge.findById(req.body.charge._id).then( charge => {
//                 charge.isCompleted = true;
//                 charge.stopDateTime = new Date();
//                 const difference =  charge.stopDateTime - charge.startDateTime
//                 const minutes = Math.round(difference / 60000); // minutes
//                 const diffDays = Math.floor(difference / 86400000); // days
//                 const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
//                 const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
//                 charge.duration = diffHrs + "h:" + diffMins + "m"
//                 // to make with a sense
//                 charge.totalBatteryCharged = 100
//                 // considering a cost of 10 cents per minutes
//                 charge.cost = ( minutes * 0.10).toFixed(2)
//
//
//                 charge.save()
//                     .then(r => {
//                         console.log(r)
//                         userController.setStatus("free", req.body.charge.user_id, "")
//                     })
//                     .then(result => {
//                         console.log("here")
//                         console.log(result)
//                         stationController.TowerRelease(req.body.charge.station_id, req.body.charge.tower_id)
//                     })
//                     .then(result => res.send(result))
//                     .catch(err => {
//                         console.log(err)
//                         res.status(500).send(err)
//                     })
//             }
//         ).catch(err => {
//             res.send(err)
//         })
//     }
// }


exports.endCharge = (req, res) => {
    //console.log("[END CHARGE] user: " + req.body.user.username)
    if (req.params.user_id === null) res.status(500).send("Charge object is missing")
    else {
        userController.setStatus("free", req.params.user_id, "")
            .then(r => {
                Charge.find({user_id: req.params.user_id}, function (err, charges) {
                    if (err) console.log(err)
                    else {
                        console.log(charges)
                        if (charges.filter(c => !c.isCompleted) > 1) res.status(500).send("multiple active charge")
                        const activeCharge = charges.find(c => !c.isCompleted)
                        if (activeCharge === undefined) res.status(500).send("No active charge found")
                        else {
                            activeCharge.isCompleted = true;
                            activeCharge.stopDateTime = new Date();
                            const difference = activeCharge.stopDateTime - activeCharge.startDateTime
                            const minutes = Math.round(difference / 60000); // minutes
                            const diffDays = Math.floor(difference / 86400000); // days
                            const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
                            const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
                            activeCharge.duration = diffHrs + "h:" + diffMins + "m"
                            // to make with a sense
                             if (req.body.batteryLevel !== null && req.body.batteryLevel > 0){
                                 activeCharge.totalBatteryCharged = req.body.batteryLevel
                             }else{
                            activeCharge.totalBatteryCharged = 100
                             }
                            // considering a cost of 10 cents per minutes
                            activeCharge.cost = (minutes * 0.10).toFixed(2)
                            activeCharge.save()
                                .then(chargeSaved => {
                                    console.log(chargeSaved)
                                    stationController.releaseTower(chargeSaved.station_id.toString(), chargeSaved.tower_id.toString())
                                })
                                .then(result => {
                                    console.log(result)
                                    res.status(200).send("charged deleted " + result)
                                }).catch(err => {
                                    console.log(err)
                                res.status(500).send(err)
                            })
                        }
                    }
                })
            })
    }
}


exports.getHistory = (req, res) => {
// getting the charge only of the specific user
//     this.findUser(req.params.user_id)
//         .then(user => res.status(200).json(user.chargeHistory))
//         .catch(err => res.status(400).send(err))

    Charge.find({user_id: req.params.user_id})
        .then(charges => res.status(200).json(charges))
        .catch(err => res.status(400).send(err))

//     Charge.find({user_id: req.params.user_id}, function (err, station) {
//         if (err)
//             res.send(err);
//         res.json(station);
//     });
};

//
// exports.occupyTower = (req, res) => {
//     Station.findById(req.body.station_id, function (err, station) {
//         if (err)
//             res.send(err);
//         else {
//             if (station == null) {
//                 res.status(404).send({
//                     description: 'station not found'
//                 });
//             } else {
//                 const firstFreeTower = station.towers.find(s => s.isAvailable)
//                 if (firstFreeTower === undefined) {
//                     res.status(500).send({
//                         description: 'All towers occupied'
//                     })
//                 } else {
//                     firstFreeTower.isAvailable = false;
//                     // Here I want to insert the current vehicle id of the user, an idea is that I keep it in the store
//                     firstFreeTower.charging_vehicle_id = req.body.user_id
//                     station.usedTowers = station.towers.filter(s => !s.isAvailable).length
//                     station.save().then(
//                         res.status(200).send(firstFreeTower)
//                     ).catch(er => {
//                             res.status(500).send(er)
//                         }
//                     )
//                 }
//             }
//         }
//     })
// }
//
// exports.releaseTowerForTimerExpired = (station_id, tower_id) => {
//     return TowerRelease(station_id, tower_id)
// }
//
// exports.releaseTower = (req, res) => {
//     TowerRelease(req.body.station_id, req.body.tower_id)
//         .then(result=>res.status(200).send(result))
//         .catch(err => res.status(500).send(err))
// }
//
// TowerRelease = (station_id, tower_id) => {
//     return new Promise((resolve, reject) => {
//         Station.findById(station_id, function (err, station) {
//             if (err) reject(err)
//             else {
//                 if (station == null) {
//                     reject('station not found')
//                 } else {
//                     const towerToFree = station.towers.find(s => s.id === tower_id)
//                     if (towerToFree === undefined) reject('tower not found')
//                     else if (towerToFree.isAvailable) reject('tower not occupied')
//                     else {
//                         towerToFree.isAvailable = true
//                         towerToFree.charging_vehicle_id = ""
//                         station.usedTowers = station.towers.filter(s => !s.isAvailable).length
//                         station.save().then(
//                             resolve("tower released")
//                         ).catch(er => {
//                                 reject('error in saving')
//                             }
//                         )
//                     }
//                 }
//             }
//
//         })
//     })
// }
