const db = require("../models");
const Station = db.station;
const UserController  = require("./user.controller")

exports.registerStation = (req, res) => {
    const station = new Station({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        totalTowers: req.body.totalTowers,
        usedTowers: req.body.usedTowers,
        towers: req.body.towers
    });

    station.save(err => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        res.send({message: "Station was registered successfully!"});
    });
};


exports.retrieveStations = (req, res) => {
    Station.find({}, function (err, station) {
        if (err)
            res.send(err);
        res.json(station);
    });
};

exports.retrieveStation = (req, res) => {
    Station.findById(req.params.id, function (err, station) {
        if (err)
            res.send(err);
        else {
            if (station == null) {
                res.status(404).send({
                    description: 'Station not found'
                });
            } else {
                res.json(station)
            }
        }
    });
};


exports.occupyTower = (req, res) => {
    Station.findById(req.body.station_id, function (err, station) {
        if (err)
            res.send(err);
        else {
            if (station == null) {
                res.status(404).send({
                    description: 'station not found'
                });
            } else {
                const firstFreeTower = station.towers.find(s => s.isAvailable)
                if (firstFreeTower === undefined) {
                    res.status(500).send({
                        description: 'All towers occupied'
                    })
                } else {
                    firstFreeTower.isAvailable = false;
                    firstFreeTower.charging_vehicle_id = req.body.user_id
                    station.usedTowers = station.towers.filter(s => !s.isAvailable).length
                    // if I will be able to retrieve the currentVehicle direclty I can refactor this
                    UserController.setIsCharging(req.body.user_id, true).then(user=>{
                        console.log(user)
                        const currVehicle = user.vehicles.find(v=>v.isCurrent)
                        firstFreeTower.charging_vehicle_id = currVehicle.id
                        station.save().then(
                            res.status(200).send(firstFreeTower)
                        ).catch(er => {
                                res.status(500).send(er)
                            }
                        )
                    }).catch(err=>res.status(500).send(err))
                    }
                }
            }
    })
}

exports.releaseTowerForTimerExpired = (station_id, tower_id) => {
    return TowerRelease(station_id, tower_id)
}

exports.releaseTower = (req, res) => {
   TowerRelease(req.body.station_id, req.body.tower_id)
       .then(result=>res.status(200).send(result))
       .catch(err => res.status(500).send(err))
}

TowerRelease = (station_id, tower_id) => {
    return new Promise((resolve, reject) => {
        Station.findById(station_id, function (err, station) {
            if (err) reject(err)
            else {
                if (station == null) {
                    reject('station not found')
                } else {
                    console.log(station.towers.map(t=>t.id),tower_id)
                    const towerToFree = station.towers.find(s => s.id.toString() === tower_id.toString())
                    if (towerToFree === undefined) reject('tower not found')
                    else if (towerToFree.isAvailable) reject('tower not occupied')
                    else {
                        towerToFree.isAvailable = true
                        towerToFree.charging_vehicle_id = ""
                        station.usedTowers = station.towers.filter(s => !s.isAvailable).length
                        station.save().then(
                            resolve("tower released")
                        ).catch(er => {
                                reject('error in saving')
                            }
                        )
                    }
                }
            }

        })
    })
}


exports.unbookTower = (req,res) =>{
    this.TowerRelease(req.body.station_id, req.body.tower_id)
        .then(response => res.status(200).send(response))
        .catch(err => res.status(500).send(err))
}