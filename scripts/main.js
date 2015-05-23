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
	
//If you wish to change the bogan size, change 9 by 13 or 19
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

//Calculating the number of intersections to place the pons 
boardSize=9*9;
var cells = document.getElementById('goban_front');


//Creating the intersections
for (var i = boardSize; i > 0; i--) 
{
	var identify1="<div class='front' id='";
    var identify2="_";
    var identify3="' onClick='test1('";
    var identify4="')'> </div>";
	console.log(identify1+row+identify2+column+identify3+row+identify2+column+identify4);
    cells.innerHTML = cells.innerHTML + identify1+row+identify2+column+identify3+row+identify2+column+identify4;
  	column++;
  	if (column==9) 
  	{
  		column=0;
  		row++;
  	};         
};

//Functions to identify the intersections, add pons etc.

var player = 1;

function test1(id) {
    var x_y = id.indexOf('_');
    console.log("l index of de xy est : "+x_y);
}

function update()
{
	if (player==1)
	{
		var element = document.getElementById(i + "_" + j);
        element.createElement("div").setAttribute("class", "player1");	
	}
	else if(player==2)
	{
		var element = document.getElementById(i + "_" + j);
        element.createElement("div").setAttribute("class", "player2");	
	};
}
