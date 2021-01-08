$("#resetButton").hide();
let fewestMoves = 1000000; //both set to ridiculously high numbers so that the first complete game is counted as a high score to be compared against.
let quickestTime = 1000000;
let resetting = false; 
let playerMoveCount = 0;
let pairsFound = 0;
let playerSelections = [];      //setting out the variables that are interacted with to form the game
let clickedBoxes =[];
let ready = false;
let runTime = 0;

const apple = "<i class='fas fa-apple-alt'></i>";
const carrot = "<i class='fas fa-carrot'></i>";
const lemon = "<i class='fas fa-lemon'></i>";
const cheese = "<i class='fas fa-cheese'></i>";
const pizza = "<i class='fas fa-pizza-slice'></i>";       //Font-awesome icons which will act as the pictures of the game.
const iceCream = "<i class='fas fa-ice-cream'></i>";
const hotdog = "<i class='fas fa-hotdog'></i>";
const fish = "<i class='fas fa-fish'></i>";
const candy = "<i class='fas fa-candy-cane'></i>";
const bacon = "<i class='fas fa-bacon'></i>";

const headline = document.getElementById("title")
// Create an array of the card contents, 10 pairs of the above icon HTML strings which will be shown as pictures in the game.
let cardElements = [apple, carrot, lemon, cheese, pizza, iceCream, hotdog, fish, candy, bacon, apple, carrot, lemon, cheese, pizza, iceCream, hotdog, fish, candy, bacon]

//Shuffle function found from Stack overflow, to randomise the order of the icons in the array ready for placing in the boxes.
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }



//Function to place the first element from the card array into the first box, on loop until 20 - randomised the array first so this loop was simpler, but could explore doing both in the same function?
function setCards(){
    shuffle(cardElements);
    var i = 0;
    
    while(i<20){
        var boxToSet = "box"+i;
        document.getElementById(boxToSet).innerHTML=cardElements[i];
        $("#"+boxToSet).css({"color": " #3f72af", "pointer-events": "auto"}); //colour and pointer events are included here as part of the reset process after a completed game, rather than needing a seperate loop within reset button.
        i++;

    }
}
//shuffle cards for the first time loading the page. Subsequent shuffles are within the reset button.
setCards();



let gameTimer;

$("#startButton").click(function(){
  headline.innerHTML = "Click two boxes to find a match";
  $("#startButton").hide();
  $("#resetButton").show(); //make the reset button the only one clickable once the game has started.
  resetting = false; //resetting var was created to know when to clear the timer. Set to false when the game begins to allow the timer to run. 
  const startTime = Date.now()
  ready = true; //ready dictates if a box can be clicked. Not ready when page loads, start button makes them ready.
  gameTimer = setInterval(function(){
    if(pairsFound<10 && resetting == false){ //checks that the game isn't finished, and we aren't waiting for the next game to begin. So, timer only runs when game is in play.
    let currentTime = Date.now();
    runTime = Math.floor(((currentTime-startTime)/1000)) 
    document.getElementById("runningTimer").innerHTML=runTime; //calculate time since that start butotn was clicked, update it in the HTML
    
  }
else if(resetting == true){ //reset the timer when the reset button is triggered.
  clearInterval(gameTimer);
  document.getElementById("runningTimer").innerHTML=0;
}
  else{ return runTime //returned so that it can be stored in the score table
}}, 100);
  

})
//all boxes are given the following click function. All boxes themselves can be treated the same because their innerHTMLs have already been set randomly, and that's what gives the identity to the player.
$(".box").click(function(){
  if (ready == true){ //stops boxes being clickable during reset, or in the delay time after the first click.
    
  playerSelections.push(this.innerHTML); //adds the icon string to be compared on next click
  var clickedBox = "#"+this.id;
  clickedBoxes.push(clickedBox); //store the id of the clicked boxes so they can both be confirmed/rejected after the second click
  
  
  $(clickedBox).css({"color": "#dbe2ef", "pointer-events": "none"}); //make selected icon visible, but not clickable again.
  
  
  if(playerSelections.length==2){ //comparisons are always made after two selections
    playerMoveCount++; //for scoring later
    lifeTimeMoves++;
    document.getElementById("moveCounter").innerHTML=playerMoveCount;
    
    if(playerSelections[0]==playerSelections[1]){ //If they match, show them as complete and make them unclickable for the rest of the game
      $(clickedBoxes[0]).css({"color": "#112d4e", "pointer-events": "none"});
      $(clickedBoxes[1]).css({"color": "#112d4e", "pointer-events": "none"});
      
      pairsFound++; //to a max of 10
      lifeTimePairs++;
      if(pairsFound==10){ //checking if the last pair has been found and the game is over
        updateTable(); //log the scores
        flashAllBoxes(flashCounter); //show an animation across the boxes letting player know the game is over.
        headline.innerHTML = "Reset to play again!";
        if(playerMoveCount<fewestMoves){ //check for a highscore, change the current highscore to the score from this attempt
          fewestMoves = playerMoveCount;
          document.getElementById("move-record-value").innerHTML=playerMoveCount;
          $("#move-record-text").show();
        }
        
        if(runTime<quickestTime){ //check for a highscore, change the current highscore to the score from this attempt
          quickestTime = runTime;
          document.getElementById("time-record-value").innerHTML=runTime
          $("#time-record-text").show();
          
        }
      }
    playerSelections = []; //clear both arrays so the [0]/[1] comparisons work for the next pair
    clickedBoxes = [];
    }
    else{
      ready = false; //set to false until the end of the timeout. Prevents rapidly clicking through too many boxes which can cause problems with the matching checks and resetting of states.
      setTimeout(function(){ //reset the boxes after a brief delay, giving the player enough time to see what the second selection was. 
        $(clickedBoxes[0]).css({"color": "#3f72af", "pointer-events": "auto"});
        $(clickedBoxes[1]).css({"color": "#3f72af", "pointer-events": "auto"}); //icons are invisible but clickable again
         ready = true; //boxes are clickable again when the timeout is over
        
    playerSelections = []; //clear both arrays for the next comparison
    clickedBoxes = [];
      }, 300)
      
      

    }
    calculateEfficiency(); 
  }
  
}})
//reset everything to its default state.
$("#resetButton").click(function(){
  headline.innerHTML = "Press the start button to begin";
  document.getElementById("resetButton").innerHTML = "Resetting in progress...";
  
  $("#move-record-text").hide(); //hide the record text so it's not in the way during the game.
  $("#time-record-text").hide(); 
  playerMoveCount = 0;
  document.getElementById("moveCounter").innerHTML=playerMoveCount;
  runTime = 0;
  document.getElementById("runningTimer").innerHTML=0;
  pairsFound = 0;
  ready = false;
  
  
  resetting = true; //for resetting timer. Needed a seperate tracker than ready, because ready is used within the game during the 300ms delay
  setTimeout(function(){
    setCards();
    document.getElementById("resetButton").innerHTML = "Reset";
    $("#resetButton").hide();
    $("#startButton").show();
  
  },1000); //wait enough time for the animation to check that we are in a reset, so stop flashing the icons. Don't make the start button clickable until reset is over.
   //reshuffle icons and make them invisible, but clickable again.
  
});




function updateTable(){ //add the latest move count and time taken to the scores table. Need to find a way to highlight the best of each. Can arrays be searched for lowest number? would need a way to remove any highlight when the newest highscore is updated.
  const table = document.getElementById("score-table")
  let row = table.insertRow(1);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  cell1.innerHTML = playerMoveCount;
  cell2.innerHTML = runTime + " seconds";
}

let boxtoFlash;
function flashIcon(boxNumber){ 
  boxtoFlash = "#box" + boxNumber; //function to make an icon flash and then go back to the complete colour. Used within a loop at the end of the game.
  $(boxtoFlash).css("color", "#dbe2ef");
  setTimeout(function(){
    $(boxtoFlash).css("color", "#112d4e");
  }, 500);
  

}
let flashCounter = 0
function flashAllBoxes(flashCounter){ //function that repeats itself after a delay, unless the game is in resetting state. Triggers the flashing animation
  setTimeout(function(){
    flashIcon(flashCounter)
    flashCounter++
    if(flashCounter<20 && resetting == false){
      flashAllBoxes(flashCounter);
    }
  }, 500)
}



// assign each box div to the css grid. Avoids lengthy #box1{grid-area: box1} repeated 20 times in the css file.
let gridhelper = 0;
while(gridhelper<20){
  let assignToGrid = "#box"+gridhelper;
  $(assignToGrid).css("grid-area", "box"+gridhelper);
  gridhelper++;
}



let playerEfficiency = 0;
let lifeTimeMoves = 0;  //create variables for the efficiency tracker. These are seperate because they track across all games played.
let lifeTimePairs = 0;
function calculateEfficiency(){
  playerEfficiency = ((lifeTimePairs/lifeTimeMoves)*100).toFixed(2);
  document.getElementById("playerEfficiency").innerHTML=playerEfficiency
}

$("#move-record-text").hide();
$("#time-record-text").hide(); //hide the text, so the player only sees it when they break their previous record.


$("#explainer-text").hide(); //Make the text explaining the efficiency score only appear when hovering over the question mark
$(".fa-question").mouseenter(function(){
  $("#explainer-text").show();
})
$(".fa-question").mouseleave(function(){
  $("#explainer-text").hide();
})






  
