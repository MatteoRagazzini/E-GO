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

    // app.get(
    //     "/api/station/retrieve",
    //     [authJwt.verifyToken],
    //     controller.retrieveStations
    // );

    app.route("/stations", [authJwt.verifyToken])
        .get(controller.retrieveStations)

    app.route("/stations", [authJwt.verifyToken, authJwt.isAdmin])
        .post(controller.registerStation)
        .put(controller.freeAllStations)
};