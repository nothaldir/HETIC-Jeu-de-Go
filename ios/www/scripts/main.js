/* 
    EN - We started some functions for the AI (not random) but, as you know, we ran out of time so you might found some functions in comments.
    FR - Nous avions commencé certains fonctions pour l'IA mais, comme vous le savez, le temps nous a manqué. C'est pourquoi vous pourriez trouver au sein du code des fonctions en commentaires.
         Tout le reste du code est commenté en anglais.
*/

//Creating the goban with JS ==>
var boardSize=9-1;
//Calculating the number of blocks (and divs) for a 9x9 goban
boardSize=boardSize*boardSize;
//The cell variable will create the goban in HTML
var cells = document.getElementById('goban_back');

var row = 0;
var column = 0;

//Calculating the number of intersections to place the powns
boardSize=9*9;
var cells = document.getElementById('goban_front');

//Creating the intersections
for (var i = boardSize; i > 0; i--)
{
    cells.innerHTML = cells.innerHTML + "<div class='front' id='"+row+"_"+column+"' onClick=\"basic('"+row+"_"+column+"')\"> </div>";
  	column++;
  	if (column==9)
  	{
  		column=0;
  		row++;
  	}
}


//Functions to identify the intersections, add powns etc.

// IA mode on (true) or false(off)
var iaMode = false;

// Current round
var round = 0;

// Each player's scores
var scoreJ1 = 0;
var scoreJ2 = 0;

// Suicide by default
var suicide = false;

// Current & Next Player
var player = 1;
var nextPlayer = 2;

// Combo
var nbCombo = null;

// The variables for the timer are set
var sec = 00;
var min = 03;

// Basic table. Stores wich player played on which intersection
var tab = new Array();
for(var x=0; x<9; x++)
   tab[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      tab[x][y] = 0;
console.log("Basic table :")
console.log(tab);


//Groups table. Stores a unique ID for each group detected
var groups = new Array();
for(var x=0; x<9; x++)
   groups[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      groups[x][y] = 0;
console.log("Groups table :")
console.log(groups);


// Takes table. Stores on which round was a stone taken. Used for the KO.
var takes = new Array();
for(var x=0; x<9; x++)
   takes[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      takes[x][y] = null;
console.log("Rounds table");
console.log(takes);


// AI names table. Pick a random name for the AI based on famous robots or AI
var element = document.getElementById("p2").innerHTML;
if (element=="Bot")
{
    var iaNames = new Array ("R2-D2", "Wall-E", "Bender","Hal 9000", "GLaDOS", "Mr. Roboto", "HK-47", "Sonny", "Smith", "Skynet", "C-3PO", "T-800", "T-1000", "ENIAC", "K2000", "Rick Deckard", "Ash");
    var temp = Math.floor((Math.random() * 16) + 1);
    var name = iaNames[temp];
    var element = document.getElementById("p2");
    element.innerHTML = name;
    iaMode = true;
    console.log("ia ON");
}


/* AI table. Unused.
var tabIa = new Array();
for(var x=0; x<9; x++)
   tab[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      tab[x][y] = 0;
*/

/* Another method to check if there is a suicide was to simulate if a capture was possible. Unused
var simulation = false;
var simule = false;
*/


// Basic function that triggers on click
function basic(id) {
    // Retrieve the X_Y ID of the div, and seperate if into two variables.
    var x_y = id.indexOf("_");
    x = parseInt(id.substring(0, x_y));
    console.log("--------------");
    console.log("x="+x);
    y = parseInt(id.substring(x_y + 1));
    console.log("y="+y);
    console.log("player : " + player);
    console.log("--------------");

    // Reset the combo
    nbCombo = 0;

    // Update de groups and check the suicide
    detectGroup();
    suicideCheck();

    // Executions of all the functions
	if (tab[x][y]!=player && tab[x][y]==0 && suicide==false && takes[x][y]!=round)
	{
        simulation=false;
        simule=false;
		round++;
		tab[x][y] = player;
		takes[x][y] = round;
        detectGroup();
        capture();
        combo();
        maj();
        playerTurn();
	}
    // That way, the AI plays right after player 1 
    if (iaMode==true && player==2)
    {
        startIA();
    }
}

// Function to start the AI behavior
function startIA()
{    
    ia();
    console.log("ia working");

    detectGroup();
    suicideCheck();

    if (tab[x][y]!=player && tab[x][y]==0 && suicide==false && takes[x][y]!=round)
    {
        simulation=false;
        simule=false;
        round++;
        tab[x][y] = player;
        takes[x][y] = round;
        detectGroup();
        capture();
        combo();
        maj();
        playerTurn();
    }
    else
    {
        startIA();
        console.log("ia not workin...");
    }
}

// Inatialize libertiesGroup depending on the stone that is about to get taken
function capture()
{
    if ( (y-1)>=0 && tab[x][y-1]==nextPlayer)
    {
        libertiesGroup(x, y-1);
        //LibertiesGroupIa(x, y-1);
    }
    if ((x+1)<row && tab[x+1][y]==nextPlayer)
    {
        libertiesGroup(x+1, y);
        //LibertiesGroupIa(x+1, y);
    }
    if ((y+1)<row && tab[x][y+1]==nextPlayer)
    {
        libertiesGroup(x, y+1);
        //libertiesGroupIa(x, y+1);
    }
    if ((x-1)>=0 && tab[x-1][y]==nextPlayer)
    {
        libertiesGroup(x-1, y);
        //libertiesGroupIa(x-1, y);
    }
}

// This function analizes each stone of a given group and check if there is any liberty.
function libertiesGroup (x,y)
{
    detectGroup();
    var groupeNum = groups[x][y];
    for (var i=0; i<row; i++)
    {
        for (var j=0; j<row; j++)
        {
            if (groups[i][j]==groupeNum && groupeNum!=0)
            {
                if ( ((j-1)>=0 && tab[i][j-1]==0)  || ((i+1)<row && tab[i+1][j]==0) || ((j+1)<row && tab[i][j+1]==0) || ((i-1)>=0 && tab[i-1][j]==0) )
                {
                    return;
                }
            }
        }
    }

    // If the function get there, then there is no liberty and all the stones that are about to be taken will be updated in the basic table.
    for (var i=0; i<row; i++)
    {
        for (var j=0; j<row; j++)
        {
            if (groups[i][j]==groupeNum)
            {
                    console.log("simule false");
                    tab[i][j] = 0;
                    takes[i][j] = round;
                    if (player==1)
                    {
                        scoreJ1++;
                        var element = document.getElementById("scoreJ1");
                        element.innerHTML = scoreJ1;
                    }
                    else
                    {
                        scoreJ2++;
                        var element = document.getElementById("scoreJ2");
                        element.innerHTML = scoreJ2;
                    }
                    nbCombo++;
            }
        }
    }
}


// Check if there is a suicide and if the player could "play" the suicide ta take a stone
function suicideCheck() {

	if ( (tab[x][y]==0) && ((x-1)<=0 || tab[x-1][y]==1) && ((y-1)<=0 || tab[x][y-1]==1) && ((y+1)>=row || tab[x][y+1]==1) && ((x+1)>=row || tab[x+1][y]==1))
    {
/*      simulation=true;
        detectGroup();
        capture();
        if (simule==true)
        {
            suicide = false;
            console.log("suicide = "+suicide);
        }
        else if (simule==false)
        {
            suicide = true;
            console.log("suicide = "+suicide);
        }
*/

		if ( ((x-1)<=0 || tab[x-1][y-1]==2) && ((x-2)<=0 || tab[x-2][y]==2) && ((x-1)<=0 || tab[x-1][y+1]==2) )
        {
			
		}
		else if ( ((y-2)<=0 || tab[x][y-2]==2) && ((x-1)<=0 || tab[x-1][y-1]==2) && ((x+1)>=row || tab[x+1][y-1]==2) )
        {
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else if ( ((y+2)>=row || tab[x][y+2]==2) && ((x-1)<=0 || tab[x-1][y+1]==2) && ((x+1)>=row || tab[x+1][y+1]==2) )
        {
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else if ( ((y-1)<=0 || tab[x+1][y-1]==2) && ((x+2)<=row || tab[x+2][y]==2) && ((x+1)>=row || tab[x+1][y+1]==2) )
        {
			suicide = false;
			console.log("suicide = "+suicide);
		}
        else
        {
            suicide = true;
            console.log("suicide = "+suicide);
        }

	}
	else if ( (tab[x][y]==0) && ((x-1)<=0 || tab[x-1][y]==2) && ((y-1)<=0 || tab[x][y-1]==2) && ((y+1)>=row || tab[x][y+1]==2) && ((x+1)>=row || tab[x+1][y]==2))
    {
/*      simulation=true;
        detectGroup();
        capture();
        if (simule==true)
        {
            suicide = false;
            console.log("suicide = "+suicide);
        }        
        else if (simule==false)
        {
            suicide = true;
            console.log("suicide = "+suicide);
        }
*/
        if ( ((x-1)<=0 || tab[x-1][y-1]==1) && ((x-2)<=0 || tab[x-2][y]==1) && ((x-1)<=0 || tab[x-1][y+1]==1) )
        {
            suicide = false;
            console.log("suicide = "+suicide);
        }
        else if ( ((y-2)<=0 || tab[x][y-2]==1) && ((x-1)<=0 || tab[x-1][y-1]==1) && ((x+1)>=row || tab[x+1][y-1]==1) )
        {
            suicide = false;
            console.log("suicide = "+suicide);
        }
        else if ( ((y+2)>=row || tab[x][y+2]==1) && ((x-1)<=0 || tab[x-1][y+1]==1) && ((x+1)>=row || tab[x+1][y+1]==1) )
        {
            suicide = false;
            console.log("suicide = "+suicide);
        }
        else if ( ((y-1)<=0 || tab[x+1][y-1]==1) && ((x+2)>=row || tab[x+2][y]==1) && ((x+1)>=row || tab[x+1][y+1]==1) )
        {
            suicide = false;
            console.log("suicide = "+suicide);
        }
        else
        {
            suicide = true;
            console.log("suicide = "+suicide);
        }
	}
	else
	{
		suicide = false;
		console.log("suicide = "+suicide);
	}
}

// This function detects all the groups
function detectGroup() {
    var group_id = 1;
    for (var x=0; x < row; x++) {
        for (var y=0; y < row; y++) {
            if (tab[x][y] == 0) {
                groups[x][y] = 0;
            }
            else {
                groups[x][y] = group_id;
                group_id++;
            }
        }
    }
    for (x = 0; x < row; x++) {
        for (y = 0; y < row; y++) {
            if ((y - 1) >= 0 && tab[x][y] == tab[x][y - 1]) {
                var former_group = groups[x][y - 1];
                for (var k = 0; k < row; k++) {
                    for (var l = 0; l < row; l++) {
                        if (groups[k][l] == former_group) {
                            groups[k][l] = groups[x][y];
                        }
                    }
                }
            }
            if ((x + 1) > row && tab[x][y] == tab[x + 1][y]) {
                var former_group = groups[x + 1][y];
                for (k = 0; k < row; k++) {
                    for (l = 0; l < row; l++) {
                        if (groups[k][l] == former_group) {
                            groups[k][l] = groups[x][y];
                        }
                    }
                }
            }
            if ((y + 1) < row && tab[x][y] == tab[x][y + 1]) {
                var former_group = groups[x][y + 1];
                for (var k = 0; k < row; k++) {
                    for (var l = 0; l < row; l++) {
                        if (groups[k][l] == former_group) {
                            groups[k][l] = groups[x][y];
                        }
                    }
                }
            }
            if ((x - 1) >= 0 && tab[x][y] == tab[x - 1][y]) {
                var former_group = groups[x - 1][y];
                for (var k = 0; k < row; k++) {
                    for (var l = 0; l < row; l++) {
                        if (groups[k][l] == former_group) {
                            groups[k][l] = groups[x][y];
                        }
                    }
                }
            }
        }
    }
}

// This function update the HTML with the datas of the basic table.
function maj() {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < row; j++) {
            if (tab[i][j] == 0)
            {
                var element = document.getElementById(i+"_"+j);
                element.innerHTML=" ";
            }
            else if (tab[i][j] == 1)
            {
                var element = document.getElementById(i+"_"+j);
                element.innerHTML="<div class='player1'> </div>";
            }
            else if (tab[i][j] == 2)
            {
                var element = document.getElementById(i+"_"+j);
                element.innerHTML="<div class='player2'> </div>";
            }
        }
    }
}

// This function set the current and next player 
function playerTurn ()
{
    if (player == 1)
    {
        nextPlayer = 1;
        player = 2;
        var element = document.getElementById("p2");
        element.className = "animated pulse infinite";
        var element = document.getElementById("p1");
        element.classList.remove("infinite");
    }
    else if (player == 2)
    {
        nextPlayer = 2;
        player = 1;
        var element = document.getElementById("p1");
        element.className = "animated pulse infinite";
        var element = document.getElementById("p2");
        element.classList.remove("infinite");
    }
}

// This function displays the combos
function combo ()
{
    console.log("combo");
    if (nbCombo >= 3 && iaMode==false)
    {
        if (nbCombo >=3 && nbCombo<=4)
        {
            var element = document.getElementById("comboDescr");
            element.innerHTML = "This is a pussy combo, you can do better !";
        }
        else if (nbCombo >=5 && nbCombo<=6)
        {
            var element = document.getElementById("comboDescr");
            element.innerHTML = "You're getting better and better. I do not like it.";
        }
        else if (nbCombo >= 7)
        {
            var element = document.getElementById("comboDescr");
            element.innerHTML = "Shit, you just mastered it ...";
        }
        sound();
        var element = document.getElementById("nbCombo");
        element.innerHTML = "Combo x"+nbCombo;
        var element = document.getElementById("combo");
        element.className = "animated fadeIn";
        document.getElementById("combo").style.display = "block";

    }
}

// Used to close the combo pop-up
function off()
{
    var element = document.getElementById("combo");
    element.className = "animated fadeOut";
    element.style["display"] = "none";
    console.log("close");
}

// Activate the combo sound effet. Only avaible on a desktop web browser.
function sound()
{
  document.getElementById("sound").play();
}

// Timer function
function timer()
{
    if (sec==00)
    {
        min--;
        sec=60;
    }
    if (sec<=10)
    {
        sec--;
        var element = document.getElementById("timer");
        element.innerHTML = "<h1>0"+min+":"+"0"+sec+"</h1>";
    }
    else if (sec>10)
    {
        sec--;
        var element = document.getElementById("timer");
        element.innerHTML = "<h1>0"+min+":"+sec+"</h1>";
    }
    if (sec==0 && min==0)
    {
        endGame();
        sec="--";
        min="--";
    }
}

// Every second, refresh the timer to remove 1 second
window.setInterval(function(){
        timer();
}, 1000);

// Set the endgame screen depending on who won the game
function endGame()
{
    // if player 1 wins
    if (scoreJ1 > scoreJ2)
    {
        var element = document.getElementById("playerwin");
        element.innerHTML = "Player 1";
    }
    // if player 2 wins
    else if (scoreJ2 > scoreJ1)
    {
        var element = document.getElementById("playerwin");
        element.innerHTML = "Player 2";
    }
    // if it's a draw
    else if (scoreJ1 == scoreJ2)
    {
        var element = document.getElementById("playerwin");
        element.innerHTML = "It's a draw !";
        var element = document.getElementById("winner");
        element.innerHTML = "You're both losers ...";
    }
    var element = document.getElementById("divEnd");
    element.className = "animated fadeIn";
    document.getElementById("divEnd").style.display = "block";
}

// AI main fcuntion,  pick randomly x and y
function ia()
{
    x = Math.floor(Math.random() * 9); 
    y = Math.floor(Math.random() * 9); 
    
    /* Function to put a stone on the opposite side of the one player 1 just played
    if (round>=0)
    {
        if (x<=4 && y<=4)
        {
            do
            {
                x = Math.floor((Math.random() * 4) + 5);
                y = Math.floor((Math.random() * 4) + 5);
                console.log("new"+x);
                console.log("new"+y);   
            }
            while (x<5 && y<5)
            var tempX = Math.floor((Math.random() * 8) + 4);
            var tempY = Math.floor((Math.random() * 8) + 4);
            console.log(tempX);
            console.log(tempY);
            x=tempX;
            y=tempY;

        }
        else if (x<=4 && y>=4)
        {
            var tempX = Math.floor((Math.random() * 4) + 4);
            var tempY = Math.floor((Math.random() * 4) + 1);
            console.log(tempX);
            console.log(tempY);
            x=tempX;
            y=tempY;
        }
        else if (x>=4 && y<=4)
        {
            var tempX = Math.floor((Math.random() * 4) + 1);
            var tempY = Math.floor((Math.random() * 4) + 4);
            console.log(tempX);
            console.log(tempY);
            x=tempX;
            y=tempY;
        }
        else if (x>=4 && y>=4)
        {
            var tempX = Math.floor((Math.random() * 4) + 1);
            var tempY = Math.floor((Math.random() * 4) + 1);
            console.log(tempX);
            console.log(tempY);
            x=tempX;
            y=tempY;
        }
    }
    */
}


/* Some works on a developped AI. Unused.

var temp = 0;

function LibertiesGroupIa (x,y) {
    detectGroup();
    var groupeNum = groups[x][y];
    for (var i=0; i<row; i++)
    {
        for (var j=0; j<row; j++)
        {
            if (groups[i][j]==groupeNum && groupeNum!=0)
            {
                if ( ((j-1)>=0 && tab[i][j-1]==0)  || ((i+1)<row && tab[i+1][j]==0) || ((j+1)<row && tab[i][j+1]==0) || ((i-1)>=0 && tab[i-1][j]==0) )
                {
                    return;
                    // Si un pion du groupe à une libertés, il n'y a pas capture
                }
            }
        }
    }


    // Si on arrive la, c'est que le groupe n'avait aucune libertés
    for (var i=0; i<row; i++)
    {
        for (var j=0; j<row; j++)
        {
            if (groups[i][j]==groupeNum)
            {
                temp++;
            }
        }
    }
}

function Bagdad()
{
    for (var x=0; x<row; x++)
    {
        for (var y=0; y<row; y++)
        {
            if (tab[x][y]==0 && (tab[x-1][y]==1 || tab[x][y-1]==1 || tab[x+1][y]==1 || tab[x][y+1])) {
                capture();
                tabIa[x][y]=temp;
            }
        }
    }
    for (var x=0; x<row; x++)
    {
        for (var y=0; y<row; y++)
        {
            var manger=0;
            if (temp>manger) {
                var manger = temp;
            };
        }
    }
}
*/