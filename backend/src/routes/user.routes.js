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
        .get(controller.getState) //DONE // retrive status
        .put(controller.updateUser) //DONE

    app.route("/users/:user_id/vehicles", [authJwt.verifyToken],)
        .get(controller.getVehicles) //DONE
        .post(controller.addVehicle) //DONE

    app.route("/users/:user_id/vehicles/:vehicle_id", [authJwt.verifyToken],)
        // .get(controller.getVehicle) //DONE
        .put(controller.updateVehicle) //DONE
        .delete(controller.deleteVehicle) //DONE

    app.route("/users/:user_id/favouriteStations", [authJwt.verifyToken],)
        .get(controller.getFavouriteStations) //DONE
        .post(controller.addFavouriteStation) //DONE

    app.route("/users/:user_id/favouriteStations/:station_id", [authJwt.verifyToken],)
        .delete(controller.deleteFavouriteStation)

}