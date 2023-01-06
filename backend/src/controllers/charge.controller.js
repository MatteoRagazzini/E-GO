const db = require("../models");
const Charge = db.charge;
const stationController = require("../controllers/station.controller");
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
    findUser(req.body.user._id).then(user=>{
        const currVehicle = user.vehicles.find(v=>v.isCurrent);
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

        charge.save(err => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
        console.log(charge)
            res.status(200).send({message: "Charge was registered successfully!"});
        });
    })
};




exports.endCharge = (req, res) => {
    Charge.findById(req.body.charge._id).then( charge => {
            charge.isCompleted = true;
            charge.stopDateTime = new Date();
            const difference =  charge.stopDateTime - charge.startDateTime
            const minutes = Math.round(difference / 60000); // minutes
            const diffDays = Math.floor(difference / 86400000); // days
            const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
            const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
            charge.duration = diffHrs + "h:" + diffMins + "m"
            // to make with a sense
            charge.totalBatteryCharged = 100
            // considering a cost of 10 cents per minutes
            charge.cost = ( minutes * 0.10).toFixed(2)

        console.log(charge)

            charge.save()
                .then(result =>stationController.releaseTowerForTimerExpired(req.body.charge.station_id, req.body.charge.tower_id))
                .then(result => res.send(result))
                .catch(err => res.status(500).send(err))
        }
    )
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
