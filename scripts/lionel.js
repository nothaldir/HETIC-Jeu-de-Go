function next_step(id) {
    var x_y = id.indexOf("_");
    var x = parseInt(id.substring(0, x_y));
    var y = parseInt(id.substring(x_y + 1));


    if (grid[x][y] != 0 || suicide(x, y) == true) {
        console.log("Impossible de jouer ici !");
        return;
    } else {
        grid[x][y] = player;

        identify_groups();
        capture(x, y);
        update_html();
        if (player == 1) {
            player = 2;
        } else {
            player = 1;
        }
    }

}

function update_html() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < rows; j++) {
            if (grid[i][j] == 0) {
                var element = document.getElementById(i + "_" + j);
                element.setAttribute("class", "empty");
            }
            if (grid[i][j] == 1) {
                var element = document.getElementById(i + "_" + j);
                element.setAttribute("class", "player1");
            } else if (grid[i][j] == 2) {
                var element = document.getElementById(i + "_" + j);
                element.setAttribute("class", "player2");
            }
        }
    }
}