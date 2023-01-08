const db = require("../models");
const Station = db.station;
const UserController  = require("./user.controller")


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
    this.TowerOccupy(req.body.user_id, req.body.station_id)
        .then(result=>res.status(200).send(result))
        .catch(err => res.status(500).send(err))
}

exports.releaseTower = (req, res) => {
   this.TowerRelease(req.body.station_id, req.body.tower_id)
       .then(result=>res.status(200).send(result))
       .catch(err => res.status(500).send(err))
}

exports.TowerOccupy = (user_id,station_id) => {
    console.log("[OCCUPY TOWER] user: " + user_id, "| station: " + station_id)
    return new Promise((resolve, reject) => {
        Station.findById(station_id, function (err, station) {
            if (err){
                reject(err);
                console.log(err)
            }
            else {
                if (station == null) {
                    reject('Station not found')
                } else {
                    const firstFreeTower = station.towers.find(s => s.isAvailable)
                    if (firstFreeTower === undefined) {
                        reject('All towers occupied')
                    } else {
                        firstFreeTower.isAvailable = false;
                        firstFreeTower.charging_vehicle_id = user_id
                        station.usedTowers = station.towers.filter(s => !s.isAvailable).length
                        // if I will be able to retrieve the currentVehicle direclty I can refactor this
                        UserController.setIsCharging(user_id, true).then(user=>{
                            const currVehicle = user.vehicles.find(v=>v.isCurrent)
                            if(currVehicle === undefined) reject("user doesn't have a vehicle in use")
                            firstFreeTower.charging_vehicle_id = currVehicle.id
                            console.log("here")
                            station.save().then(
                                resolve(firstFreeTower)
                            ).catch(err => reject(err))
                        }).catch(err=>(err))
                    }
                }
            }
        })
    })
}

exports.TowerRelease = (station_id, tower_id) => {
    console.log("[RELEASE TOWER] station: " + station_id, "| tower: " + tower_id)
    return new Promise((resolve, reject) => {
        if(station_id=== undefined || tower_id === undefined) reject("Impossible to release tower due to undefined parameters")
        else{
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
        }
    })
}
