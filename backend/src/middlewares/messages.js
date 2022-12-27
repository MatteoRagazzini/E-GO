//
//
//
// io.on('connection', function(socket) {
//     console.log('A user connected');
//     socket.broadcast.emit('customEmit', 'hola')
//
//     //Whenever someone disconnects this piece of code executed
//     socket.on('disconnect', function () {
//         console.log('A user disconnected');
//     });
//
//     socket.on("marker", (data) => {
//
//         console.log("inside on occupy listener" + data)
//     })
// });
//
//
// function emitMessage(){
//     socket.on('disconnect', function () {
//         console.log('A user disconnected');
//     });
// }