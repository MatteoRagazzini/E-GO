const db = require("../models");
const Station = db.station;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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


exports.occupyTower = (req, res) => {
    console.log("here")
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
                if(firstFreeTower==null){
                    res.status(500).send({
                        description: 'All towers occupied'
                    })
                }
                firstFreeTower.isAvailable = false;
                station.usedTowers = station.towers.filter(s => s.isAvailable).length
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

exports.freeTower = (req, res) => {
    Station.findById(req.body.station_id, function (err, station) {
        if (err)
            res.send(err);
        else {
            if (station == null) {
                res.status(404).send({
                    description: 'station not found'
                });
            } else {
                const towerToFree = station.towers.find(s=>s.id == req.body.tower_id)
                if(towerToFree==null){
                    res.status(500).send({
                        description: 'tower not existing'
                    })
                }
                else if(towerToFree.isAvailable){
                    res.status(500).send('tower already available')
                }
                else{
                    towerToFree.isAvailable = true
                    station.usedTowers = station.towers.filter(s => !s.isAvailable).length
                    station.save().then(
                        res.status(200).send("Tower correctly freed")
                    ).catch(er => {
                            res.status(500).send(er)
                        }
                    )
                }
            }
        }
    });
}