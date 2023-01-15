const db = require("../models");
const Station = db.station;
const UserController = require("./user.controller")


exports.retrieveStations = (req, res) => {
    Station.find({})
        .then(stations => res.status(200).json(stations))
        .catch(err => res.status(400).send({message: err}))
};

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


exports.freeAllStations = (req, res) => {
    Station.find({}, function (err, stations) {
        if (err)
            res.send({message: err});
        else {
            if (stations === null) {
                res.status(404).send({message: 'Stations not found'});
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
                res.status(200).send({message: "All stations free"})
            }
        }
    })
}


exports.occupyTower = (user_id, station_id) => {
    return new Promise((resolve, reject) => {

        if (user_id === undefined || station_id === undefined) reject( "Impossible to release tower due to undefined parameters")

        this.findStationByID(station_id)
            .then(station => {
                const firstFreeTower = station.towers.find(s => s.isAvailable)
                if (firstFreeTower === undefined) {
                    reject('All towers occupied')
                } else {
                    firstFreeTower.isAvailable = false;
                    station.usedTowers = station.towers.filter(s => !s.isAvailable).length
                    UserController.findUser(user_id)
                        .then(user => {
                            const currVehicle = user.vehicles.find(v => v.isCurrent)
                            if (currVehicle === undefined) reject( "Add a vehicle and put it in use to continue")
                            firstFreeTower.charging_vehicle_id = currVehicle.id
                            station.save()
                                .then(res => {
                                    resolve(firstFreeTower)
                                })
                                .catch(err => reject(err))
                        })
                        .catch(err => reject("Impossible to change user status"))
                }
            }).catch(err => reject(err))
    })
}

exports.releaseTower = (station_id, tower_id) => {

    return new Promise((resolve, reject) => {

        if (station_id === undefined || tower_id === undefined) reject({message: "Impossible to release tower due to undefined parameters"})


        this.findStationByID(station_id)
            .then(station => {
                const towerToFree = station.towers.find(s => s.id.toString() === tower_id.toString())
                if (towerToFree === undefined) reject({message: 'tower not found'})
                else if (towerToFree.isAvailable) reject({message: 'tower not occupied'})
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





exports.findStationByID = (station_id) => {
    return new Promise((resolve, reject) => {
        Station.findById(station_id, function (err, station) {
            if (err)
                reject({message: err});
            else {
                if (station === null) {
                    reject({message: 'Station not found'})
                } else {
                    resolve(station)
                }
            }
        });
    })
}

