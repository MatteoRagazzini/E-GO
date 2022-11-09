const mongoose = require('mongoose');
model = require("../models/userModel")(mongoose)

exports.show_homepage = (req,res)=>{
    res.sendFile(appRoot + '/www/index.html');
}