(function ($) {
    var socket = io.connect("http://localhost:8088");

    var game = {};

    $('#player_pseudo').submit(function (event) {
        socket.emit('pseudo',{
            player_pseudo: $('#player_pseudo').val()
        });
    });



})
