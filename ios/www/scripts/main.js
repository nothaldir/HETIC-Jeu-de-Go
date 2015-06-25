

//Creating the goban with JS ==>

//If you wish to change the goban size, change 9 by 13 or 19
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

var iaMode = false;

var round = 0;

var scoreJ1 = 0;
var scoreJ2 = 0;

var suicide = false;

var player = 1;
var nextPlayer = 2;

var previousJ1 = null;
var PreviousJ2 = null;

var nbCombo = null;


// Tableau de base
var tab = new Array();
for(var x=0; x<9; x++)
   tab[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      tab[x][y] = 0;
console.log("Tableau de base :")
console.log(tab);



//Tableau groupes
var groups = new Array();
for(var x=0; x<9; x++)
   groups[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      groups[x][y] = 0;
console.log("tableau des groupes")
console.log(groups);


// Stock à quel tour un pion a été mangé
var takes = new Array();
for(var x=0; x<9; x++)
   takes[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      takes[x][y] = null;
console.log("Tableau tours");
console.log(takes);


// Tableau des noms de robots aléatoire
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


//Tableau qui stocke les possibilité de l'Ia
var tabIa = new Array();
for(var x=0; x<9; x++)
   tab[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      tab[x][y] = 0;


function basic(id) {
    var x_y = id.indexOf("_");
    x = parseInt(id.substring(0, x_y));
    console.log("x="+x);
    y = parseInt(id.substring(x_y + 1));
    console.log("y="+y);
    console.log("player : " + player);
    console.log("--------------");

    nbCombo = 0;

    detectGroup();
    suicideCheck();

	if (tab[x][y]!=player && tab[x][y]==0 && suicide==false && takes[x][y]!=round)
	{
		round++;
		tab[x][y] = player;
		takes[x][y] = round;
        detectGroup();
        capture();
        combo();
        maj();
        playerTurn();
	}

    if (iaMode==true)
    {
        ia();
        console.log("ia working");
        nbCombo = 0;

        detectGroup();
        suicideCheck();

        if (tab[x][y]!=player && tab[x][y]==0 && suicide==false && takes[x][y]!=round)
        {
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
            ia();
        }
    }
}


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

                //prisonniersJoueur ++;
                // Donc on remet à 0 les pions capturés du groupe et on increment la variable de
            }
        }
    }
}




// Function suicide (interdit au joueur de poser son pion sur une case vide si celle ci est entourée par 4 pions de même famille)
function suicideCheck() {

	if ( (tab[x][y]==0) && ((x-1)<=0 || tab[x-1][y]==1) && ((y-1)<=0 || tab[x][y-1]==1) && ((y+1)>=row || tab[x][y+1]==1) && ((x+1)>=row || tab[x+1][y]==1))
    {
		if ( ((x-1)<=0 || tab[x-1][y-1]==2) && ((x-2)<=0 || tab[x-2][y]==2) && ((x-1)<=0 || tab[x-1][y+1]==2) )
        {
			suicide = false;
			console.log("suicide = "+suicide);
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


function detectGroup() {
    var group_id = 1;
    for (var x=0; x < row; x++) {
        for (var y=0; y < row; y++) {
            if (tab[x][y] == 0) {
                // si ya rien bah ya rien
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
            // Left
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
            // Down
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
            // Right
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
            // Up
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


function combo ()
{
    console.log("combo");
    if (nbCombo >= 3)
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

function off()
{
    var element = document.getElementById("combo");
    element.className = "animated fadeOut";
    element.style["display"] = "none";
    console.log("close");
}

function sound()
{
  document.getElementById("sound").play();
}

var sec = 00;
var min = 05;


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

window.setInterval(function(){
        timer();
}, 1000);

function endGame()
{
    if (scoreJ1 > scoreJ2)
    {
        var element = document.getElementById("playerwin");
        element.innerHTML = "Player 1";
    }
    else if (scoreJ2 > scoreJ1)
    {
        var element = document.getElementById("playerwin");
        element.innerHTML = "Player 2";
    }
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

function ia()
{
    x = Math.floor(Math.random() * 9); 
    y = Math.floor(Math.random() * 9); 
    return x;
    return y;
    
    /*    
    console.log("old"+x);
    console.log("old"+y);
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


/*var temp = 0;


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

function attack()
{

}

function defense()
{

}

function territory()
{

}