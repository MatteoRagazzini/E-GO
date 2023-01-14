const { authJwt } = require("../middlewares");
const controller = require("../controllers/charge.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // app.get(
    //     "/api/charge/history/:id",
    //     [authJwt.verifyToken],
    //     controller.getHistory
    // );
    //
    // app.post(
    //     "/api/charge/start",
    //     [authJwt.verifyToken],
    //     controller.startCharge
    // );
    //
    // app.post(
    //     "/api/charge/end",
    //     [authJwt.verifyToken],
    //     controller.endCharge
    // );

    app.route(("/charges/:user_id"),[authJwt.verifyToken])
        .get(controller.getHistory)

    app.route("/charges", [authJwt.verifyToken])
        .post(controller.startCharge)
        .post(controller.endCharge)
    ;
};