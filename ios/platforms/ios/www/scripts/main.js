/*
construction du jeu
1. développer le goban
	tableau avec classe pour chaque TD (déconseillé fortement)
	div à coté des autres avec un float left pour retour à la ligne après 19 classe
2. repérer et récup les cases
	préférable dans tableau à deux dimensions (X et Y)
3. générer plateau en JS pour modif easy plus tard
4. créer un fichier js avec toutes les variables
5. à qui le tour et pion adéquat (variable pour joueur en cours)
6. regarder les disponibilités autour et en choisir une au hasard
7. repérer si partie finie, groupe mangé etc...

Récursivité : fonction qui s apelle elle même
on code actuellement en itératif (suite d instructions)

A RETENIR : VARIABLES LOCALES ET GLOBALES (avec ou sans var) !!!

*/


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

var player = 1;

var round = 0;

var pointJ1 = 0;
var pointJ2 = 0;

var suicide = false;

var waitingPlayer = 2;


// on cree le tableau bleu, contenant les lignes
var tab = new Array();
// on cree les lignes (tableau vert) les unes après les autres
for(var x=0; x<9; x++)
   tab[x] = new Array();
// on parcourt les lignes...
for(var x=0; x<9; x++)
   // ... et dans chaque ligne, on parcourt les cellules
   for(var y=0; y<9; y++)
      tab[x][y] = 0;
console.log("Tableau de base :")
console.log(tab);



//Tableau groupes
var tabM = new Array();
for(var x=0; x<9; x++)
   tabM[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      tabM[x][y] = 0;
console.log("tableau des groupes")
console.log(tabM);


// Tableau qui stock les tours
var rounds = new Array();
for(var x=0; x<9; x++)
   rounds[x] = new Array();
for(var x=0; x<9; x++)
   for(var y=0; y<9; y++)
      rounds[x][y] = null;
console.log("Tableau tours");
console.log(rounds);


function basic(id) {
    var x_y = id.indexOf("_");
    x = parseInt(id.substring(0, x_y));
    console.log("x="+x);
    y = parseInt(id.substring(x_y + 1));
    console.log("y="+y);

    // suicideCheck();

	if (player==1 && tab[x][y]==0 && suicide==false && rounds[x][y]!=round-2)
	{
		// var element = document.getElementById(x+"_"+y);
		// element.innerHTML="<div class='player1'> </div>";
		round++;
		tab[x][y] = player;
		rounds[x][y] = round;
		// player=2;
		console.log("coucoucocuocucoucoucuocu");
	}
	else if(player==2 && tab[x][y]==0 && suicide==false)
	{
		// var element = document.getElementById(x+"_"+y);
		// element.innerHTML="<div class='player2'> </div>";
		round++;
		tab[x][y] = player;
		rounds[x][y] = round;
		// player=1;
	}

	//miam();
	detectGroup();
	capture();
	maj();
	playerTurn();
}

/* Function miam

function miam() {
    for (var x = 0; x < row; x++) {
        for (var y = 0; y < row; y++) {
			if (tab[x][y]==1 && tab[x-1][y]==2 && tab[x][y-1]==2 && tab[x][y+1]==2 && tab[x+1][y]==2) {
				tab[x][y]=0;
				console.log("le pion "+x+"_"+y+" fut miam");
				document.getElementById(x+"_"+y).innerHTML=" ";
				pointJ1++;
				console.log("J1, nombre de points = "+pointJ1);
			}
			else if (tab[x][y]==2 && tab[x-1][y]==1 && tab[x][y-1]==1 && tab[x][y+1]==1 && tab[x+1][y]==1) {
				tab[x][y]=0;
				console.log("le pion "+x+"_"+y+" fut miam");
				document.getElementById(x+"_"+y).innerHTML=" ";
				pointJ2++;
				console.log("J2, nombre de points = "+pointJ2);
			}
		}
	}
}

*/

function capture()
{
    if ( (y-1)>=0 && tab[x][y-1]==waitingPlayer)
    {
        libertiesGroup(x, y-1);
    }
    if ((x+1)<row && tab[x+1][y]==waitingPlayer)
    {
        libertiesGroup(x+1, y);
    }
    if ((y+1)<row && tab[x][y+1]==waitingPlayer)
    {
        libertiesGroup(x, y+1);
    }
    if ((x-1)>=0 && tab[x-1][y]==waitingPlayer)
    {
        libertiesGroup(x-1, y);
    }
}


function libertiesGroup (x,y)
{
    detectGroup();
    var groupeNum = tabM[x][y];
    for (var i=0; i<row; i++)
    {
        for (var j=0; j<row; j++)
        {
            if (tabM[i][j]==groupeNum && groupeNum!=0)
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
            if (tabM[i][j]==groupeNum)
            {
                tab[i][j] = 0;
                //prisonniersJoueur ++;
                // Donc on remet à 0 les pions capturés du groupe et on increment la variable de
            }
        }
    }
}



// Function suicide (interdit au joueur de poser son pion sur une case vide si celle ci est entourée par 4 pions de même famille)
function suicideCheck() {
	if (tab[x][y]==0 && tab[x-1][y]==1 && tab[x][y-1]==1 && tab[x][y+1]==1 && tab[x+1][y]==1) {
		if (tab[x-1][y-1]==2 && tab[x-2][y]==2 && tab[x-1][y+1]==2) {
			// possibilité 1
			// tu ne peux pas peux jouer si au tour d'avant, P1 a bouffé ton pion
			// sinon tu peux jouer
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else if (tab[x][y-2]==2 && tab[x-1][y-1]==2 && tab[x+1][y-1]==2) { // possibilité 2
			// idem
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else if (tab[x][y+2]==2 && tab[x-1][y+1]==2 && tab[x+1][y+1]==2) { // possibilité 3
			// idem
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else if (tab[x+1][y-1]==2 && tab[x+2][y]==2 && tab[x+1][y+1]==2) { // possibilité 4
			// idem
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else
		{
			suicide = true;
			console.log("suicide = "+suicide);
		}
	}
	else if (tab[x][y]==0 && tab[x-1][y]==2 && tab[x][y-1]==2 && tab[x][y+1]==2 && tab[x+1][y]==2) {
		if (tab[x-1][y-1]==1 && tab[x-2][y]==1 && tab[x-1][y+1]==1) {
			// possibilité 1
			// tu ne peux pas peux jouer si au tour d'avant, P1 a bouffé ton pion
			// sinon tu peux jouer
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else if (tab[x][y-2]==1 && tab[x-1][y-1]==1 && tab[x+1][y-1]==1) { // possibilité 2
			// idem
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else if (tab[x][y+2]==1 && tab[x-1][y+1]==1 && tab[x+1][y+1]==1) { // possibilité 3
			// idem
			suicide = false;
			console.log("suicide = "+suicide);
		}
		else if (tab[x+1][y-1]==1 && tab[x+2][y]==1 && tab[x+1][y+1]==1) { // possibilité 4
			// idem
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
                tabM[x][y] = 0;
            }
            else {
                tabM[x][y] = group_id;
                group_id++;
            }
        }
    }
    for (x = 0; x < row; x++) {
        for (y = 0; y < row; y++) {
            // Left
            if ((y - 1) >= 0 && tab[x][y] == tab[x][y - 1]) {
                var former_group = tabM[x][y - 1];
                for (var k = 0; k < row; k++) {
                    for (var l = 0; l < row; l++) {
                        if (tabM[k][l] == former_group) {
                            tabM[k][l] = tabM[x][y];
                        }
                    }
                }
            }
            // Down
            if ((x + 1) > row && tab[x][y] == tab[x + 1][y]) {
                var former_group = tabM[x + 1][y];
                for (k = 0; k < row; k++) {
                    for (l = 0; l < row; l++) {
                        if (tabM[k][l] == former_group) {
                            tabM[k][l] = tabM[x][y];
                        }
                    }
                }
            }
            // Right
            if ((y + 1) < row && tab[x][y] == tab[x][y + 1]) {
                var former_group = tabM[x][y + 1];
                for (var k = 0; k < row; k++) {
                    for (var l = 0; l < row; l++) {
                        if (tabM[k][l] == former_group) {
                            tabM[k][l] = tabM[x][y];
                        }
                    }
                }
            }
            // Up
            if ((x - 1) >= 0 && tab[x][y] == tab[x - 1][y]) {
                var former_group = tabM[x - 1][y];
                for (var k = 0; k < row; k++) {
                    for (var l = 0; l < row; l++) {
                        if (tabM[k][l] == former_group) {
                            tabM[k][l] = tabM[x][y];
                        }
                    }
                }
            }
        }
    }
}

function playerTurn ()
{
    if (player == 1)
    {
        waitingPlayer = 1;
        player = 2;
    }
    else
    {
        waitingPlayer = 2;
        player = 1;
    }
}

function maj() {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < row; j++) {
            if (tab[i][j] == 0)
            {
                var element = document.getElementById(i+"_"+j);
				element.innerHTML=" ";
				console.log("text0");
            }
            else if (tab[i][j] == 1)
            {
                var element = document.getElementById(i+"_"+j);
				element.innerHTML="<div class='player1'> </div>";
				console.log("text1");
            }
            else if (tab[i][j] == 2)
            {
                var element = document.getElementById(i+"_"+j);
				element.innerHTML="<div class='player2'> </div>";
				console.log("text2");
            }
        }
    }
}
