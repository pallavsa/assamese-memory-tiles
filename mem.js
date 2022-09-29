
//variables
const winMessageItem = "overlay_win";
const imgIdPrfx = "tile_";

var attemptCount = 0;
//define the html code block in js
var htmlContainer ;
var arrayHiddenValues = []; //shuffle the tiles
var arrayCurrentValues = []; //running value the tiles
var arrayCurrentStates = [];  //running state the tiles : 0 : blank, 1 : exposed, 2 : solved
var flippedTile; //track the already flipped image, if none flipped, set to -1
var pairsToSolve; //track how many pairs remain to solve

function createHtmlBlock () {
  let containerClass="tile_container_"+squareSize;
  let tileClass="tile_"+squareSize;
  htmlContainer  = `  <div class="`+containerClass+`">`;
  for (i = 0; i < squareSize*squareSize; i++) {
    htmlContainer += `    <div class="`+tileClass+`"><img id="tile_`+i+`"  class="im" /></div>`;
  }
  htmlContainer += `
    <div class="overlay_win" id="overlay_win">
      <h2>You win!</h2>
      <div id="replay">Play again</div>
    </div>
  </div>
  <div class="count_container">
    <div class="count_text" id="count"> Attemp count: </div>
    <div class="button" id="btnRestart">Restart </div>
  </div>
  `;
  return htmlContainer;
}

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

  //console.log(myImg.src);
  //console.log("line 3: " + arrayCurrentStates[i]);

  if (arrayCurrentStates[i] == 0) {  //current tile is blank
    arrayCurrentValues[i] = arrayHiddenValues[i]; //flip the tile image
    arrayCurrentStates[i] = 1; // tile is flipped
    //console.log("State 0, flippedTile:"+flippedTile);
    myImg.src = arrayCurrentValues[i];
  }

  //check if there is a tile already flipped for matching
  if (flippedTile < 0) {  // no tile other is flipped for matching
    flippedTile = i;
    //console.log("new flip"+flippedTile);
  }
  else { // compare the two flipped Tiles so long they are different
    //console.log("Comparing");
    if (arrayCurrentValues[i] == arrayCurrentValues[flippedTile]) { // we got a match
      arrayCurrentStates[i] = 2 ;
      arrayCurrentStates[flippedTile] = 2 ;
      pairsToSolve = pairsToSolve -1 ;
      flippedTile = -1;
      //console.log("Solved");
      if (pairsToSolve == 0) {
        add_class(winMessageItem, "overlay_win_open");
      }

    }
    else { // no match, flip the tiles back & reset the state of the tiles
      //console.log("Failed");
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
    //console.log(myImg);
    attemptCount = attemptCount+1 ;
    document.getElementById('count').textContent= " Attemp count: " +  attemptCount;
    toggleImg(i,myImg);
  }
}

//This function shuffles the tiles
//set the tile array with image IDs
function shuffle() {
  let j;
  let t;
  let k;
  let A = [];

  for (i = 0; i < (squareSize*squareSize/2); i++) {
    k = 1;
    do {
      k = Math.ceil(Math.random() * letterend);
    //  console.log("Loop : "+i+ " Value: "+k + "Index of K: " + A.indexOf(k));
    } while (A.indexOf(k) > -1)  //if this value is already there, find another
    A[i] = k;
  }
  A.push(...A);
  //console.log(A);
  for (i = 0; i < squareSize*squareSize; i++) {
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
  for (i = 0; i < squareSize*squareSize; i++) {
    let B = A[i] + letterRangeStart;
    arrayHiddenValues[i] = pathQuizImg + B + ".jpg";
  }
}

//reset everything
function reset() {
  var myImg;

  flippedTile = -1;  //none of the tiles are flipped
  pairsToSolve = (squareSize*squareSize)/2; // unsolved pairs
  attemptCount =0;
  document.getElementById('count').textContent= " Attemp count: " +  attemptCount;
  shuffleImg()
  for (i = 0; i < squareSize*squareSize; i++) {
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
document.body.innerHTML = createHtmlBlock ();
//add reset function
document.getElementById("btnRestart").onclick = function() {
  reset();
};
document.getElementById(winMessageItem).onclick = function() {
  reset();
};
//reset counters & tiles
reset();
