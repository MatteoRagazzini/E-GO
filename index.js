const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 3000

global.appRoot = path.resolve(__dirname);

mongoose.connect('mongodb://localhost/e-go', { useNewUrlParser: true})
    .then(() => console.log("Connected"))
    .catch(err => console.log(err));

app.use(cors())

//Per gestire i parametri passati nel corpo della richiesta http.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/static', express.static(__dirname + '/public'));

var routes = require('./src/routes/router');
routes(app);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

// app.get('/', (req, res) => {
//     res.send('E-go app!')
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})