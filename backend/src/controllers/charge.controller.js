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

        userController.setStatus("CONNECTED", req.body.user._id, req.body.station._id)
            .then(r =>
                charge.save(err => {
                    if (err) {
                        res.status(400).send({message: err});
                        return;
                    }
                    res.status(200).send({message: "Charge was registered successfully!"});
                })
            )
    })
};


exports.endCharge = (req, res) => {
    if (req.params.user_id === null) res.status(400).send({message: "Charge object is missing"})
    else {
        userController.setStatus("FREE", req.params.user_id, "")
            .then(r => {
                Charge.find({user_id: req.params.user_id}, function (err, charges) {
                    if (err) res.status(400).send({message: "Charge object is missing"})
                    else {
                        if (charges.filter(c => !c.isCompleted) > 1) res.status(400).send({message: "multiple active charge"})
                        const activeCharge = charges.find(c => !c.isCompleted)
                        if (activeCharge === undefined) res.status(400).send({message: "no active charge found"})
                        else {
                            activeCharge.isCompleted = true;
                            activeCharge.stopDateTime = new Date();
                            const difference = activeCharge.stopDateTime - activeCharge.startDateTime
                            const minutes = Math.round(difference / 60000); // minutes
                            // const diffDays = Math.floor(difference / 86400000); // days
                            const diffHrs = Math.floor((difference % 86400000) / 3600000); // hours
                            const diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes
                            activeCharge.duration = diffHrs + "h:" + diffMins + "m"
                            // to make with a sense
                            if (req.body.batteryLevel !== null && req.body.batteryLevel > 0) {
                                activeCharge.totalBatteryCharged = req.body.batteryLevel
                            } else {
                                activeCharge.totalBatteryCharged = 100
                            }
                            // considering a cost of 10 cents per minutes
                            activeCharge.cost = (minutes * 0.10).toFixed(2)
                            activeCharge.save()
                                .then(chargeSaved => stationController.releaseTower(chargeSaved.station_id, chargeSaved.tower_id))
                                .then(result => res.status(200).send("charged deleted " + result))
                                .catch(err => res.status(400).send({message: err}))
                        }
                    }
                })
            })
    }
}


exports.getHistory = (req, res) => {
    Charge.find({user_id: req.params.user_id})
        .then(charges => res.status(200).json(charges))
        .catch(err => res.status(400).send({message:err}))
};

