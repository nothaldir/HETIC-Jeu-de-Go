/* function pion_bleue()
{
	document.getElementById("bleue").innerHTML="<img src='images/pion_bleue.png' alt='bleue'>"
}

function pion_rose()
{
	document.getElementById("rose").innerHTML="<img src='images/pion_rose.png' alt='rose'>"
}
*/
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
6. repérer si partie finie, groupe mangé etc...	

Récursivité : fonction qui s apelle elle même
on code actuellement en itératif (suite d instructions)

1. regarder les disponibilités autour et en choisir une au hasard 
*/
var boardSize=9-1;
boardSize=boardSize*boardSize;
console.log(boardSize);
var cells = document.getElementById('goban_back');

var x = 0;
var y = 0;

for (var i = boardSize; i > 0; i--) 
{
    cells.innerHTML = cells.innerHTML + "<div class='back'> </div>";        
};

console.log(boardSize);
boardSize=9*9;
console.log(boardSize);
var cells = document.getElementById('goban_front');


for (var i = boardSize; i > 0; i--) 
{
    cells.innerHTML = cells.innerHTML + "<div class='front' id='"+x+"_"+y+"'onClick='pion()'> </div>";
  	y++;
  	if (y==9) 
  	{
  		y=0;
  		x++;
  	};         
};


var player = 1;

function pion(x, y)
{
	var id = x.id;
	console.log('area element id = ' + id);	
	
	if (player==1) 
	{	
		document.getElementById("0_0").innerHTML="<img src='images/blue.png' alt='blue' class='pink'>";
		player=2;
	}
	else if (player==2)
	{
		document.getElementById('0_1').innerHTML="<div class='mon_cercle'></div>";
		//document.getElementById('0_1').innerHTML="<img src='images/pink.png' alt='pink' class='pink'>";
		player=1;
	}
	;	
}
