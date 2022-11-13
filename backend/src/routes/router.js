const { authJwt } = require("../middlewares");
const controller = require("../controllers/controller");

module.exports = function(app) {
    app.get("/", controller.show_homepage);
};