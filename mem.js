
//variables
const winMessageItem = "overlay_win";
const imgIdPrfx = "tile_";
//define the html code block in js
const htmlContainer =
`
<div class="tile_container">
  <div class="tile"><img id="tile_0"  class="im" /></div>
  <div class="tile"><img id="tile_1"  class="im" /></div>
  <div class="tile"><img id="tile_2"  class="im" /></div>
  <div class="tile"><img id="tile_3"  class="im" /></div>
  <div class="tile"><img id="tile_4"  class="im" /></div>
  <div class="tile"><img id="tile_5"  class="im" /></div>
  <div class="tile"><img id="tile_6"  class="im" /></div>
  <div class="tile"><img id="tile_7"  class="im" /></div>
  <div class="tile"><img id="tile_8"  class="im" /></div>
  <div class="tile"><img id="tile_9"  class="im" /></div>
  <div class="tile"><img id="tile_10" class="im" /></div>
  <div class="tile"><img id="tile_11" class="im" /></div>
  <div class="tile"><img id="tile_12" class="im" /></div>
  <div class="tile"><img id="tile_13" class="im" /></div>
  <div class="tile"><img id="tile_14" class="im" /></div>
  <div class="tile"><img id="tile_15" class="im" /></div>
  <div class="overlay_win" id="overlay_win">
    <h2>You win!</h2>
    <div id="replay">Play again</div>
  </div>
</div>
`;
var arrayHiddenValues = []; //shuffle the tiles
var arrayCurrentValues = []; //running value the tiles
var arrayCurrentStates = [];  //running state the tiles : 0 : blank, 1 : exposed, 2 : solved
var flippedTile; //track the already flipped image, if none flipped, set to -1
var pairsToSolve; //track how many pairs remain to solve


function add_class(id, cl) {
  var elem = document.getElementById(id);
  if (elem.classList.contains(cl) !== true) {
    elem.classList.add(cl);
  }
}

function rem_class(id, cl) {
  var elem = document.getElementById(id);
  if (elem.classList.contains(cl) === true) {
    elem.classList.remove(cl);
  }
}

function toggleImg(i,myImg) {
  if ( i == flippedTile ) { //if you click on currently revealed file, do nothing
    return;
  }
  if (arrayCurrentStates[i] == 2) { //already solved, do nothing
    return;
  }

  console.log(myImg.src);
  console.log("line 3: " + arrayCurrentStates[i]);

  if (arrayCurrentStates[i] == 0) {  //current tile is blank
    arrayCurrentValues[i] = arrayHiddenValues[i]; //flip the tile image
    arrayCurrentStates[i] = 1; // tile is flipped
    console.log("State 0, flippedTile:"+flippedTile);
    myImg.src = arrayCurrentValues[i];
  }

  //check if there is a tile already flipped for matching
  if (flippedTile < 0) {  // no tile other is flipped for matching
    flippedTile = i;
    console.log("new flip"+flippedTile);
  }
  else { // compare the two flipped Tiles so long they are different
    console.log("Comparing");
    if (arrayCurrentValues[i] == arrayCurrentValues[flippedTile]) { // we got a match
      arrayCurrentStates[i] = 2 ;
      arrayCurrentStates[flippedTile] = 2 ;
      pairsToSolve = pairsToSolve -1 ;
      flippedTile = -1;
      console.log("Solved");
      if (pairsToSolve == 0) {
        add_class(winMessageItem, "overlay_win_open");
      }

    }
    else { // no match, flip the tiles back & reset the state of the tiles
      console.log("Failed");
      setTimeout(function() {
        arrayCurrentStates[i] = 0 ;
        arrayCurrentValues[i] = blankImg;
        myImg.src = arrayCurrentValues[i];

        arrayCurrentStates[flippedTile] = 0 ;
        arrayCurrentValues[flippedTile] = blankImg;

        var oldImg = document.getElementById(imgIdPrfx + flippedTile);
        oldImg.src = arrayCurrentValues[flippedTile];
        flippedTile = -1;
      }, 1000);
    }
  }
}

//enable mouse click on Tiles
function add_elem(i) {
  document.getElementById(imgIdPrfx + i).onclick = function() {
    var myImg=document.getElementById(imgIdPrfx + i);
    console.log(myImg);
    toggleImg(i,myImg);
  }
}

//This function shuffles the tiles
//set the tile array with image IDs
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

//set the tile image tied to each tile
function shuffleImg() {
  var A = shuffle();
  for (i = 0; i < 16; i++) {
    arrayHiddenValues[i] = pathQuizImg + A[i] + ".jpg";
  }
}

//reset everything
function reset() {
  var myImg;

  flippedTile = -1;  //none of the tiles are flipped
  pairsToSolve = 8; //there are 8 unsolved pairs

  shuffleImg()
  for (i = 0; i < 16; i++) {
    myImg = document.getElementById(imgIdPrfx+i);
    myImg.src = blankImg; //set tile to blank image
    arrayCurrentStates[i] = 0; //reset all tiles state to 0
    arrayCurrentValues[i]=blankImg;  //reset tile attributes to blank image
    add_elem(i);  //add the on triggers (onClick)
  }

  rem_class(winMessageItem, "overlay_win_open"); //hide message
}

//actual flow starts here
//create htmlContainer
document.body.innerHTML = htmlContainer;
//add reset function
document.getElementById(winMessageItem).onclick = function() {
  reset();
};
//reset counters & tiles
reset();
