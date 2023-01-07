const { authJwt } = require("../middlewares");
const controller = require("../controllers/reservation.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/reservation/:id",
        [authJwt.verifyToken],
        controller.getReservation
    );

    app.post(
        "/api/reservation/create",
        [authJwt.verifyToken],
        controller.createReservation
    );

    app.post(
        "/api/reservation/delete",
        [authJwt.verifyToken],
        controller.deleteReservation
    );
};