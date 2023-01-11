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

    app.get("/api/test/all", controller.allAccess);

    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

    app.get(
        "/api/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );

    app.post("/api/user/addVehicle", [authJwt.verifyToken], controller.addVehicle);

    app.post("/api/user/removeVehicle", [authJwt.verifyToken], controller.removeVehicle);

    app.get("/api/user/vehicles/:id", [authJwt.verifyToken], controller.getVehicles);

    app.get("/api/user/:idUser/vehicles/:idVehicle", [authJwt.verifyToken], controller.getVehicle);

    app.post("/api/user/updateVehicle", [authJwt.verifyToken], controller.updateVehicle);

    app.post("/api/user/setVehicleInUse", [authJwt.verifyToken], controller.setVehicleInUse);

    app.post("/api/user/addFavouriteStation", [authJwt.verifyToken], controller.addFavouriteStation);

    app.post("/api/user/removeFavouriteStation", [authJwt.verifyToken], controller.removeFavouriteStation);

    app.get("/api/user/favouriteStations/:id", [authJwt.verifyToken], controller.getFavouriteStations);

    app.get("/api/user/state/:id", [authJwt.verifyToken], controller.getState);

    app.post("/api/user/connect", [authJwt.verifyToken], controller.connect);

    app.post("/api/user/updateProfile", [authJwt.verifyToken], controller.updateProfile);

    app.post("/api/user/setShowOnlyFavourites", [authJwt.verifyToken], controller.setShowOnlyFavourites);


    // app.post("/api/user/isCharging", [authJwt.verifyToken], controller.isCharging);

}