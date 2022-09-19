function toggleImg(i,myImg) {
  console.log(myImg.src);
  console.log("line 3: " arrayCurrentStates[i]);
  if (arrayCurrentStates[i] == 0) {  //current tile is blank
    arrayCurrentValues[i] = arrayHiddenValues[i]; //flip the tile image
    arrayCurrentStates[i] = 1; // tile is flipped
    console.log("State 0, flippedTile:"+flippedTile);
  }
//  else if (arrayCurrentStates[i] == 1) { //already the tile is revealed
//    arrayCurrentValues[i] = blankImg;
//    arrayCurrentStates[i] = 0; // tile is flipped
//  }

  //check if there is a tile already flipped for matching
  if (flippedTile < 0) {  // no tile other is flipped for matching
    flippedTile = i;
    console.log("new flip"+flippedTile);
  }
  else if ( i == flippedTile ){ // compare the two flipped Tiles so long they are different
    console.log("Comparing");
    if (arrayCurrentValues[i] == arrayCurrentValues[flippedTile]) { // we got a match
      arrayCurrentStates[i] = 2 ;
      arrayCurrentStates[flippedTile] = 2 ;
      pairsToSolve = pairsToSolve -1 ;
      console.log("Solved");
    }
    else { // no match, flip the tiles back & reset the state of the tiles
      console.log("Failed");
      arrayCurrentStates[i] = 0 ;
      arrayCurrentValues[i] = blankImg;

      arrayCurrentStates[flippedTile] = 2 ;
      arrayCurrentValues[flippedTile] = blankImg;
//      oldImg = document.getElementById("tile_icon_" + flippedTile);
//      oldImg.src = arrayCurrentValues[flippedTile];
    }
  }
  console.log(arrayCurrentValues[i]);
  myImg.src = arrayCurrentValues[i];  //set the new image
  console.log(myImg.src);
}

//enable mouse click on Tiles

//This function adds the selected class of a selected tile

function add_elem(i) {
  document.getElementById("tile_icon_" + i).onclick = function() {
    var myImg=document.getElementById("tile_icon_" + i);
    console.log(myImg);
    toggleImg(i,myImg);
  }
}

//This function shuffles the tiles
//set the tile array
function shuffle() {
  var j;
  var t;
  var A = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];

  for (i = 0; i < 16; i++) {
    j = Math.floor(Math.random() * (i + 1));
    t = A[i];
    A[i] = A[j];
    A[j] = t;
  }
  return A;
}

//set the tile image (for testing)
function shuffleImg() {
  var myImgPrfx="tile_icon_";
  var myImgName;
  var myImg;
  var A = shuffle();

  for (i = 0; i < 16; i++) {
    //myImgName = myImgPrfx+i;
    //myImg = document.getElementById(myImgName);
    //myImg.src = "img/02-0"+ A[i] + ".jpg";
    arrayHiddenValues[i] = "img/02-0"+ A[i] + ".jpg";
  }
}

//reset everything
function reset() {
  var myImgPrfx="tile_icon_";
  var myImgName;
  var myImg;

  flippedTile = -1;  //none of the tiles are flipped
  pairsToSolve = 8; //there are 8 unsolved pairs

  shuffleImg()
  for (i = 0; i < 16; i++) {
    myImgName = myImgPrfx+i;
    myImg = document.getElementById(myImgName);
    myImg.src = blankImg; //set tile to blank image
    arrayCurrentStates[i] = 0; //reset all tiles state to 0
    arrayCurrentValues[i]=blankImg;  //reset tile attributes to blank image
    add_elem(i);  //add the on triggers (onClick)
  }
//  console.log(arrayHiddenValues);
//  console.log(arrayCurrentValues);
//  console.log(arrayCurrentStates);
}
//do stuff here

//variables
const blankImg="img/00-00.jpg";
var arrayHiddenValues = []; //shuffle the tiles
var arrayCurrentValues = []; //running value the tiles
var arrayCurrentStates = [];  //running state the tiles : 0 : blank, 1 : exposed, 2 : solved
var flippedTile; //track the already flipped image, if none flipped, set to -1
var pairsToSolve; //track how many pairs remain to solve
reset();
