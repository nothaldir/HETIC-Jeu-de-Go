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

//Creating the goban blocks
for (var i = boardSize; i > 0; i--) 
{
    cells.innerHTML = cells.innerHTML + "<div class='back'> </div>";        
};

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
  	};         
};

//Functions to identify the intersections, add powns etc.

var player = 1;

var round = 0;


// on cree le tableau bleu, contenant les lignes
var tab = new Array();

// on cree les lignes (tableau vert) les unes après les autres
for(var i=0; i<9; i++)
   tab[i] = new Array();	

// on parcourt les lignes...
for(var i=0; i<9; i++)
   // ... et dans chaque ligne, on parcourt les cellules
   for(var j=0; j<9; j++)
      tab[i][j] = 0;

console.log(tab);

function basic(id) {
    var x_y = id.indexOf("_");
    var x = parseInt(id.substring(0, x_y));
    console.log("x="+x);
    var y = parseInt(id.substring(x_y + 1));
    console.log("y="+y);
	
	tab[x][y] = player;
	console.log(tab);

	if (player==1)
	{
		var element = document.getElementById(x+"_"+y);
		element.innerHTML="<div class='player1'> </div>";
		player=2;
		round++;	
		console.log("C'est le tour n°"+round);
	}
	else if(player==2)
	{
		var element = document.getElementById(x+"_"+y);
		element.innerHTML="<div class='player2'> </div>";        
		player=1;
		console.log("C'est le tour n°"+round);
	};
}

