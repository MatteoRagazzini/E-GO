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
        towers : req.body.towers
    });

    station.save(err => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.send({ message: "Station was registered successfully!" });
    });
};


exports.retrieveStations = (req, res) => {
    Station.find({}, function(err, station) {
        if (err)
            res.send(err);
        res.json(station);
    });
};

// 1) user click on reserve



exports.occupyTower = (req,res) =>{
    Station.findById(req.params.id, function(err, station) {
        if (err)
            res.send(err);
        else{

            station.towers.find(s => s.isAvailable())
            if(user==null){
                res.status(404).send({
                    description: 'User not found'
                });
            }
            else{
                res.json(user.favouriteStations);
            }
        }
    });
}

exports.freeTower= (req,res) =>{

}