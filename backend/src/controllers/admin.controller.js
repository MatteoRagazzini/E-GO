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
