
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const controller = require("./src/controllers/station.controller");

const {createServer} = require('http');
const {Server} = require("socket.io");
const app = express();
const port = 3000
const socketPort = 3002
const path = require('path')

//Per gestire i parametri passati nel corpo della richiesta http.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())





app.use('/static', express.static(__dirname + '/public'));

// app.use(function(req, res) {
//     res.status(404).send({url: req.originalUrl + ' not found'})
// });

require('./src/routes/router')(app)
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
require('./src/routes/station.routes')(app);
require('./src/routes/admin.routes')(app);
require('./src/routes/charge.routes')(app);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origins: ['http://localhost:8080'],
        method: ["GET","POST"]
    }
});

io.on('connection', function(socket) {
    let timer = null;
    let timeout = null;
    let time = null;
    let battery = (Math.round(Math.random() * (95 - 80) + 80));
    console.log('A user connected');
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });


    socket.on("startTimer", (data) => {
        console.log(data)
        io.emit("ChangeMarker", "inc");
        // in case of reserving I send back a longer timer
        if(data.reason === "reserve") time = 500;
        else time = 10;

        socket.emit("timer", time)
        timer = setInterval(() => {
            time--;
            socket.emit("timer", time)
        }, 1000)
        timeout = setTimeout(() => {
            clearInterval(timer)
            controller.releaseTowerForTimerExpired(data.station, data.tower).then(res => {
                console.log(res)
                socket.emit("expired")
                io.emit("ChangeMarker", "dec");
            })
        }, time*1000)
    });

    socket.on("cancelTimer", () => {
        clearInterval(timer)
        clearTimeout(timeout)
        socket.emit("expired")
        io.emit("ChangeMarker", "dec");
    })

    socket.on("startCharge",()=>{
        clearInterval(timer)
        clearTimeout(timeout)
        timer = setInterval(() => {
            battery++;
            socket.emit("battery", battery)
            if(battery===100){
                socket.emit("chargeCompleted")
                clearInterval(timer)
            }
        }, 1000)
    })
})

//Whenever someone connects this gets executed

global.appRoot = path.resolve(__dirname);

const db = require("./src/models");
const Role = db.role;

const dbConfig = require("./src/config/db.config.js")
db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });








httpServer.listen(socketPort, () => console.log(`Listening on port ${socketPort}`));


app.listen(3000, () => {
    console.log(`Example app listening on port ${port}`)
})


function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}


