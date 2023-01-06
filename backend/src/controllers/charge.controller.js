const db = require("../models");
const Charge = db.charge;
const stationController = require("../controllers/station.controller");

exports.startCharge = (req, res) => {
    const charge = new Charge({
        user_id: req.body.user_id,
        station_id: req.body.station_id,
        tower_id: req.body.tower_id,
        vehicle_id: req.body.vehicle_id,
        isCompleted: false,
        startDateTime: new Date(),
        stopDateTime: null,
        duration: null,
        totalBatteryCharged: null,
        cost: null
    });

    console.log(charge)

    charge.save(err => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        // stationController.occupyTower(res,req)
        res.status(200).send({message: "Charge was registered successfully!"});
    });
};




exports.endCharge = (req, res) => {
    // TowerRelease(req.body.station_id, req.body.tower_id)
    //     .then(result=>res.status(200).send(result))
    //     .catch(err => res.status(500).send(err))
}



exports.getHistory = (req, res) => {
// getting the charge only of the specific user
    Charge.find({user_id:req.params.id}, function (err, station) {
        if (err)
            res.send(err);
        res.json(station);
    });
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
