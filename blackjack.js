//global variables
let deck= []; 
const suitNames = ["hearts","diamonds","spades", "clubs"];
const faceNames = ["J","Q","K","A"];
let hitCount=0;
let playerStand=false;
let gameOver=false;
let dealer = {};
let player1 = {};
let winner=document.querySelector(".winner");


//build a card object with number value and suit value
//build an array of card objects that acts as a deck
function buildDeck() {
  
  var addCards =function() {
    for(var j=0; j<suitNames.length; j++){
      for(var i=2;i<11; i++) {
        let card = {
          name: i + "_of_" + suitNames[j],
          value: i,
          altValue:i,
          suit: suitNames[j]
        };
        deck.push(card);
      }
    }
  };
  addCards();

  var addFaceCards = function() {
    for(var j=0; j<suitNames.length; j++){
      for(var i= 0; i<faceNames.length; i++){
        let card = {
          name: faceNames[i] + "_of_" + suitNames[j],
          value: 10,
          altValue: 10,
          suit: suitNames[j]
        };
        //Aces worth either 11 or 1 pt
          if(faceNames[i]=="A") {
            card.value = 11;
            card.altValue=1;
          }
        deck.push(card);
      }
    }
  };
  addFaceCards();


  //console.log(deck);
 
};


//debugger
//console.log(deck.length);

//ask the player for their name using prompt method
// var getName= function(){
//   var name=prompt("What is your name?");
//   while(name =="" || name==null){
//     name =prompt("Please enter an acutal name");
//   }
//   alert("Hi " + name +"!");
//   return name;
// };


//Ask player for their name using input field. 
let playerName="Player";//default value
var subbutton = document.getElementById('subbutton');
subbutton.addEventListener('click', getUserName, false);

function getUserName(){
  playerName=document.getElementById("name").value;
  console.log("name given was " + playerName);
playerTitle.textContent=`${playerName}'s Hand`;
return playerName;
}; 

//display player name
let playerTitle=document.querySelector(".player");
playerTitle.textContent=`${playerName}'s Hand`;

//display to window
function displayMessage(str){
winner.innerHTML+= str;
let br =document.createElement("br");
winner.appendChild(br);
}

//handle hit event
let hitbutton= document.getElementById("hit");
hitbutton.addEventListener("click", function(){
  addHitCard(player1);
});

//handle stand event
let standbutton=document.getElementById("stand");
standbutton.addEventListener("click",dealerTurn);


//clears the deck after a game

let quitButton= document.getElementById("quit");
quitButton.addEventListener("click", playGame);



//RESERVED FOR FUTURE USE--reset players without resetting money
function clearHands(){
  clearHand(player1);
  clearHand(dealer);
}

function clearHand(person){
  person.hand=[];
  person.handValue=0;
  person.gamelost=false;
  person.blackjack=false;
  person.playmore=true;
}


//main game logic
function playGame(){
//reset globals
deck=[]
  hitCount=0;
  gameOver=false;
  playerStand=false;
  hitbutton.removeAttribute("disabled", "");
  standbutton.removeAttribute("disabled", "");
  winner.textContent="";
  displayMessage("New Game Started");
  //build deck
  buildDeck();
  //initialize players
  dealer = new player("Dealer");
  player1 = new player(playerName);
  let section =document.querySelectorAll("section");
  section[0].classList.add(dealer.name);
  section[1].classList.add(player1.name);
  //deal
  dealCards();
  console.log(player1.hand);
  displayHTMLhand(dealer);
  displayHTMLhand(player1);
  showHand(); //console display function only
  //calculate hand values
  player1.handValue=sumValue(player1);
  dealer.handValue=sumValue(dealer);
  showValue(player1); //console only
  showValue(dealer); //console only
  //check for naturals
  checkNatural(player1);
  getWinner();

};






//make a player object that has a "hand" property- an  array of the cards they've been dealt. create two instances of the object: the Dealer, and Player 1.
function player(name){
  this.name=name;
  this.hand = [];
  this.handValue=0;
  this.gamelost=false;
  this.blackjack=false;
  this.playmore=true;
  this.hit= function(){
    var index = Math.floor(Math.random()*(52-hitCount)); // yields 0-51, then less as cards are drawn and array shrinks

    //debuggers
    /*console.log(deck[index]);
    //console.log("Index: "+ index);
    */
    
    var pickedCard = {...deck.splice(index,1)};
    this.hand.push(pickedCard);
    console.log(pickedCard);
    hitCount++;
   // console.log(52-hitCount);
  }
}





//debuggers
/*console.log(dealer);
//console.log(player1);
*/

//randomly splice the deck array twice and then push results into Dealer's hand. Repeat for Player 1.
function dealCards() {
  dealer.hit();
  dealer.hit();
  player1.hit();
  player1.hit();
}




console.log(player1.hand);
//debuggers
/*console.log(dealer.hand);
//console.log(player1.hand);
//console.log(deck);
//console.log(deck.length);*/


// create and display hand on HTML

function displayHTMLhand(player){
//console.log(player);
  let playerHand=document.querySelector(`.${player.name}`);
//console.log(dealerHand); 
  // let hand = document.createElement("div");
  // console.log(`${player.name}-hand`);
  let hand=document.getElementById(`${player.name}-hand`);
  // console.log(hand);
  hand.innerHTML=createHTMLhand(player);
  // playerHand.appendChild(hand);

};

function createHTMLhand(player){
  let html = "";
  player.hand.forEach((card,i)=>{
     console.log(card);
    let handCard='';
    console.log(card[0].name);
    if(i===0 && player.name==="Dealer" && playerStand===false){
    handCard =  `<div class="overlay-container"><img src='images/back.png' class='card'><div class='overlay'></div></div>`
    }else{
    
    handCard = `<div class="overlay-container"><div class='overlay'></div><img src='images/${card[0].name}.png' class='card'></div>`;
    }
    html+=handCard;
  });
  return html;
}







//console log to show Player 1 their hand and one of the Dealer's cards
function showHand(){
  displayMessage(`The Dealer's facedown card is: ${dealer.hand[0][0].name}`);
  console.log("The Dealer's facedown card is:", dealer.hand[0][0].name);

  var handString = "";
 
  for(var i=0; i<player1.hand.length; i++){
    handString += player1.hand[i][0].name + "\n";
   
  }
  displayMessage(`${player1.name}'s hand: ${handString}`);
  console.log(player1.name +"'s hand:\n" + handString); 
}


function sumValue(person){
  var handValue = 0;
  for(var i=0; i<person.hand.length; i++){
    handValue += person.hand[i][0].value;
  }
  return handValue;
}



//debugging
function showValue(person){
  displayMessage(`The value of ${person.name}'s hand:${person.handValue}`);
    console.log("The value of " + person.name +"'s hand:",person.handValue);
};




//check to make sure that neither the Dealer nor Player 1 have a "natural" hand of 21 (comprised of an Ace and Ten) by summing the value of the Hand array.
function checkNatural(person){
  displayMessage("Now checking for naturals...");
  console.log("Now checking for naturals...");
  if(dealer.hand[1][0].value==10 || dealer.hand[1][0].value==11) {
    displayMessage(`Since the dealer has a ${dealer.hand[1][0].name}, the dealer will now peek to see if the facedown card results in blackjack.`);
    console.log("Since the dealer has a " + dealer.hand[1][0].name + ", the dealer will now peek to see if the facedown card results in blackjack.");
    displayMessage(`Dealer's facedown card was ${dealer.hand[0][0].name}`); //debug
    console.log("Dealer's facedown card was ", dealer.hand[0][0].name); //debug
    checkBJ(dealer);
    if(dealer.blackjack){
      displayMessage(`The facedown card was ${dealer.hand[0][0].name}`);
      console.log("The facedown card was ", dealer.hand[0][0].name);
    } else {
      displayMessage("Dealer has no naturals.");
      console.log("Dealer has no naturals.");
    }
  }
  displayMessage(`Now checking ${person.name} for naturals...`);
  console.log("Now checking " + person.name + " for naturals...");
  checkBJ(person);
  if(!person.blackjack) {
    displayMessage(`${person.name} has no naturals`);
    console.log(person.name + " has no naturals");
  }
}


//display winner if there was a natural
function getWinner(){
  if((dealer.blackjack==true && player1.blackjack==true) 
    || (dealer.gamelost==true && player1.gamelost==true)){
    console.log(" GAME OVER: It's a tie!");
    displayMessage("GAME OVER: It's a tie!");
  // showWinner("Nobody");
  }else if(player1.blackjack==true || dealer.gamelost==true){
    displayMessage(`GAME OVER: ${player1.name} won!`);
    //showWinner(player1.name);
  }else if(dealer.blackjack==true || player1.gamelost==true){
    displayMessage(`GAME OVER: ${dealer.name} won!`)
    //showWinner(dealer.name);
  }else if(gameOver){
    if(player1.handValue==dealer.handValue){
      //showWinner("Nobody");
       displayMessage("GAME OVER: It's a tie!");
      console.log(" GAME OVER: It's a tie!");
    }else if(player1.handValue>dealer.handValue){
      //showWinner(player1.name);
       displayMessage(`GAME OVER: ${player1.name} won!`);
    }else{
     // showWinner(dealer.name);
      displayMessage(`GAME OVER: ${dealer.name} won!`)
    }
  }

  
}


// //print winner to HTML
// function showWinner(person){

//   winner.textContent+=`Game Over: ${person} won!`;
// }




//add card to hand and update hand value
function addHitCard(player){
  console.log(player);
  player.hit();
  displayHTMLhand(player);
  player.handValue=sumValue(player);
  showValue(player);
}



function dealerTurn(){
  playerStand=true;
  hitbutton.setAttribute("disabled", "");
  standbutton.setAttribute("disabled", "");
  checkBust(player1);
  checkBJ(player1);
  displayHTMLhand(dealer);
//If the sum of the Dealer's hand is 17 or over, the dealer stands.
  while(dealer.handValue<17){
  addHitCard(dealer);
  checkBust(dealer);
  checkBJ(dealer);
  }
  gameOver=true;
  getWinner();

}



//Player 1 can hit or stay. Create a checkfunction that checks if either player's hand is over 21. If yes,make the value of the Ace 1 instead of 11. If still yes, signal that the person who busted lost. If not, check for 21. 
var checkBust=function(person){
 handValue=sumValue(person);
  if(handValue > 21){
    console.log(person.name +" busted!")
    person.gamelost=true;
  }
}
  
function checkBJ(person){
    handValue=sumValue(person);
  if(handValue ==21){
    console.log(person.name +" has blackjack!");
    person.blackjack=true;
  }
}




//need an if statement to change ace value to 1 if busted



/*If not, check if dealer's hand is 17 or over. 
Else, dealer should draw a card and run the stay function again. 
If  conditions two or three are met, display both players' hands. 
Whoever has the greater sum in hand wins.*/


//feature wishlist
//play button greyed out until name is entered
/*transition effect when play is selected
betting money
split and double down*/
