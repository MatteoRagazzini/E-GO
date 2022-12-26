const { authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.put(
        "/admin/freeAllStation",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.freeAllStation
    )

    // app.post(
    //     "/api/station/tower/connect",
    //     controller.connect
    // )
};