const db = require("../models");
const Station = db.station;
const UserController = require("./user.controller")


exports.retrieveStations = (req, res) => {
    Station.find({}, function (err, station) {
        if (err)
            res.send(err);
        res.json(station);
    });
};

exports.findStationByID = (station_id) => {
    return new Promise((resolve, reject) => {
        Station.findById(station_id, function (err, station) {
            if (err)
                reject(err);
            else {
                if (station === null) {
                    reject('Station not found')
                } else {
                    resolve(station)
                }
            }
        });
    })
}

// exports.executePromise = (promise, req, res) => {
//     this.promise
//         .then(result => res.status(200).send(result))
//         .catch(err => res.status(500).send(err))
// }



exports.occupyTower = (user_id, station_id) => {
    return new Promise((resolve, reject) => {

        if (user_id === undefined || station_id === undefined) reject("Impossible to release tower due to undefined parameters")
        console.log("[OCCUPY TOWER] user: " + user_id, "| station: " + station_id)

        this.findStationByID(station_id)
            .then(station => {
                const firstFreeTower = station.towers.find(s => s.isAvailable)
                if (firstFreeTower === undefined) {
                    reject('All towers occupied')
                } else {
                    firstFreeTower.isAvailable = false;
                    station.usedTowers = station.towers.filter(s => !s.isAvailable).length
                    UserController.setIsCharging(user_id, true)
                        .then(user => {
                            const currVehicle = user.vehicles.find(v => v.isCurrent)
                            if (currVehicle === undefined) reject("user doesn't have a vehicle in use")
                            firstFreeTower.charging_vehicle_id = currVehicle.id
                        })
                        .catch(err => reject("Impossible to change user status"))
                    station.save()
                        .then(res => {
                            resolve(firstFreeTower)
                        })
                        .catch(err => reject(err))
                }
            }).catch(err => reject(err))
    })
}

exports.releaseTower = (station_id, tower_id) => {

    return new Promise((resolve, reject) => {

        if (station_id === undefined || tower_id === undefined) reject({message:"Impossible to release tower due to undefined parameters"})
        console.log("[RELEASE TOWER] station: " + station_id, "| tower: " + tower_id)


        this.findStationByID(station_id)
            .then(station => {
                const towerToFree = station.towers.find(s => s.id.toString() === tower_id.toString())
                console.log(towerToFree)
                if (towerToFree === undefined) reject({message:'tower not found'})
                else if (towerToFree.isAvailable) reject({message:'tower not occupied'})
                else {
                    towerToFree.isAvailable = true
                    towerToFree.charging_vehicle_id = ""
                    station.usedTowers = station.towers.filter(s => !s.isAvailable).length
                    station.save().then(
                        resolve("tower released")
                    ).catch(err => reject(err))
                }
            })
            .catch(err => reject(err))
    })
}

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
        res.status(200).send({message: "Station was registered successfully!"});
    });
};


exports.freeAllStation = (req, res) => {
    Station.find({}, function (err, stations) {
        if (err)
            res.send(err);
        else {
            if (stations == null) {
                res.status(404).send({
                    description: 'Stations not found'
                });
            } else {
                stations.forEach(s => {
                        s.towers.forEach(t => {
                            t.isAvailable = true
                            t.charging_vehicle_id = ""
                        })
                        s.usedTowers = 0
                        s.save()
                    }
                )
                res.status(200).send("All stations free")
            }
        }
    })
}
