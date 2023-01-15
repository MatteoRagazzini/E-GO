const mongoose = require("mongoose");
// let Reservation = require("../src/models/reservation.model");
let User = require("../src/models/user.model");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server.js");
// eslint-disable-next-line no-unused-vars
let should = chai.should();

const DEFAULT_USER_ID = "63c313c32bb7381ed9082417"
const DEFAULT_STATION_ID = 2
const DEFAULT_TOWER_ID = 3
const DEFAULT_VEHICLE_ID = 4
const DEFAULT_ISACTIVE = true
const DEFAULT_STARTDATE = null
const DEFAULT_STOPDATETIME = null
const DEFAULT_DURATION = 10;

chai.use(chaiHttp);

describe("User Test", () => {
    const baseurl = "/users";
    before("remove elements from user.vehicles collection", (done) => {
        User.updateOne({_id:DEFAULT_USER_ID}, {$set: {vehicles: []}}, () => done());
    });

    after("close connection" ,(done) => {
        mongoose.connection.close();
        done();
    });

    describe('/GET user/vehicles', () => {
        it('it should GET the user/vehicles', (done) => {
            chai.request(server)
                .get('/users/' + DEFAULT_USER_ID + '/vehicles/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });


    describe('/POST user/vehicles', () => {
        it('it should POST a new vehicles to the user', (done) => {
            chai.request(server)
                .post('/users/' + DEFAULT_USER_ID + '/vehicles/')
                .send({
                    name: "dummy vehicle",
                    vehicleType: "e-scooter",
                    img: "dummy img",
                    batteryLevel: 100,
                    isCharging: false,
                    isCurrent: false
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('acknowledged').eql(true);
                    done();
                });
        });
    });

    describe('/GET user/vehicles', () => {
        it('it should GET the user/vehicles', (done) => {
            chai.request(server)
                .get('/users/' + DEFAULT_USER_ID + '/vehicles/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
});
