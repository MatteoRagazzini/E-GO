const db = require("../models");
const Station = db.station;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.freeAllStation = (req, res) => {
    Station.find({}, function (err, stations) {
        if (err)
            res.send(err);
        else {
            if (stations == null) {
                res.status(404).send({
                    description: 'stations not found'
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
                res.status(200).send("all Stations free")
            }
        }
    })
}

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
                if (firstFreeTower == null) {
                    res.status(500).send({
                        description: 'All towers occupied'
                    })
                }
                firstFreeTower.isAvailable = false;
                // Here I want to insert the current vehicle id of the user, an idea is that I keep it in the store
                firstFreeTower.charging_vehicle_id = "test"
                station.usedTowers = station.towers.filter(s => !s.isAvailable).length
                station.save().then(
                    res.status(200).send(firstFreeTower)
                ).catch(er => {
                        res.status(500).send(er)
                    }
                )
            }
        }
    });
}

