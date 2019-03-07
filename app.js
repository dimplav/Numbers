const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

server = app.listen(3000);

var players = ["", ""];
const io = require("socket.io")(server);
io.on('connection', (socket) => {

    if (players[0] == "" && players[1] == "") {
        players[0] = socket.id;
    }
    else if (players[0] == "" && players[1] != "") {
        players[0] = socket.id;
    } else if (players[0] != "") {
        players[1] = socket.id;
    }
    socket.username = "Anonymus";
    socket.on('change_username', (data) => {
        socket.username = data.username;
    });

    socket.on('adding_player', (player) => {
        io.emit('players', { igrac1: players[0], igrac2: players[1] });
    });

    socket.on('new_message', (data) => {
        io.emit('new_message', { message: data.message, username: socket.username });
    });

    socket.on('stop0', (value) => {
        io.emit('stop0', { number: value.number, stoping: value.stoping });
    });
    socket.on('stop1', (value) => {
        io.emit('stop1', { number: value.number, stoping: value.stoping });
    });
    socket.on('stop2', (value) => {
        io.emit('stop2', { number: value.number, stoping: value.stoping });
    });
    socket.on('stop3', (value) => {
        io.emit('stop3', { number: value.number, stoping: value.stoping });
    });
    socket.on('stop4', (value) => {
        io.emit('stop4', { number: value.number, stoping: value.stoping });
    });
    socket.on('stop5', (value) => {
        io.emit('stop5', { number: value.number, stoping: value.stoping });
    });
    socket.on('game_started', (task) => {
        io.emit('game_started', { task: task.task });

    });

    socket.on('result', (result) => {
        io.emit('result', { result: result.result, user: result.user });
    });

    socket.on('disconnect', (dummy) => {
        if (socket.id == players[0]) {
            players[0] = "";
        } else if (socket.id == players[1]) {
            players[1] = "";
        }
    });
});



var clients = [];
io.sockets.on('connection', function (socket) {
    clients.push(socket.id);
});

