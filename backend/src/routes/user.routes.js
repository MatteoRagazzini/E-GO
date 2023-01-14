const {authJwt} = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.route("/users/:user_id", [authJwt.verifyToken],)
        .get(controller.getState)
        .put(controller.updateUser)

    app.route("/users/:user_id/vehicles", [authJwt.verifyToken],)
        .get(controller.getVehicles)
        .post(controller.addVehicle)

    app.route("/users/:user_id/vehicles/:vehicle_id", [authJwt.verifyToken],)
        .put(controller.updateVehicle)
        .delete(controller.deleteVehicle)

    app.route("/users/:user_id/favouriteStations", [authJwt.verifyToken],)
        .get(controller.getFavouriteStations)
        .post(controller.addFavouriteStation)

    app.route("/users/:user_id/favouriteStations/:station_id", [authJwt.verifyToken],)
        .delete(controller.deleteFavouriteStation)

}