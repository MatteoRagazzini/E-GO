const { authJwt } = require("../middlewares");
const controller = require("../controllers/station.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/station/retrieve",
        [authJwt.verifyToken],
        controller.retrieveStations
    );

    app.post(
        "/api/station/register",
        controller.registerStation
    );

    app.post(
        "/api/station/tower/occupy",
        [authJwt.verifyToken],
        controller.occupyTower
    );

    app.post(
        "/api/station/tower/release",
        [authJwt.verifyToken],
        controller.releaseTower
    );

    app.post(
        "/api/station/tower/unlock",
        [authJwt.verifyToken],
        controller.releaseTower
    );

    // app.post(
    //     "/api/station/tower/connect",
    //     controller.connect
    // )
};