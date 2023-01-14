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

    app.route("/reservations", [authJwt.verifyToken])
        .post(controller.createReservation)
    ;

    app.route("/reservations/:user_id", [authJwt.verifyToken])
        .put(controller.deleteReservation)
    ;
};