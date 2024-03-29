const dbConfig = require("../config/db.config")

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.url = dbConfig.url
db.user = require("./user.model");
db.role = require("./role.model");
db.station =  require("./station.model");
db.charge = require("./charge.model");
db.reservation =  require("./reservation.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;