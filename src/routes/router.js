module.exports = function (app){
    var controller = require('../controllers/controller')

    app.route('/').get(controller.show_homepage)
}