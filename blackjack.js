// require("babel-core").transform("code", options);

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
let tips;


//build a card object with number value and suit value
//build an array of card objects that acts as a deck
function buildDeck() {
  
  function addCards() {
    for(var j=0; j<suitNames.length; j++){
      for(var i=2;i<11; i++) {
        let card = {
          name: i + "_of_" + suitNames[j],
          value: i,
          suit: suitNames[j]
        };
        deck.push(card);
      }
    }
  }
  addCards();

  function addFaceCards() {
    for(var j=0; j<suitNames.length; j++){
      for(var i= 0; i<faceNames.length; i++){
        let card = {
          name: faceNames[i] + "_of_" + suitNames[j],
          value: 10,
          suit: suitNames[j]
        };
        //Aces worth either 11 or 1 pt
          if(faceNames[i]=="A") {
            card.value = 11;
          }
        deck.push(card);
      }
    }
  }
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
let subbutton = document.getElementById('subbutton');
let nameInput = document.getElementById('name');
nameInput.addEventListener('keyup', getUserName, false);
subbutton.addEventListener('click', playGame, false);

function getUserName(){
  let fullName=this.value.split(" ").join("");
  playerName=fullName;
  // console.log("name given was " + playerName);
playerTitle.textContent=`${playerName}'s Hand`;
return playerName;
}; 

//Test sign-in box transition
// let testbutton = document.getElementById("testbutton");
// testbutton.addEventListener('click', hide, false);

function hide(){
  let signIn=document.querySelector(".sign-in");
  let game=document.querySelector(".game");
  // signIn.style.height=0;
  // signIn.style.display=none;
  signIn.classList.add("hidden");
  signIn.addEventListener("transitionend",function(){
     game.classList.remove("hidden");
  })
 
}

//show/hide instructions
let rulesbutton=document.getElementById("instructions");
rulesbutton.addEventListener("click",toggleRules);
function toggleRules(){
  
 let rules=document.querySelector(".instructions");
  if(this.textContent==="Show Instructions"){
    this.textContent="Hide Instructions";
  }else if(this.textContent==="Hide Instructions"){
    this.textContent="Show Instructions";
  }

 
  console.log(rules);
  rules.classList.toggle("hidden");
}

//display player name
let playerTitle=document.querySelector(".player");
playerTitle.textContent=`${playerName}'s Hand`;

//display to window
function displayMessage(str){
winner.innerHTML+= str;
let br =document.createElement("br");
winner.appendChild(br);
}

//display tooltips
function setTooltip(){

tips = document.querySelectorAll(".fa-container");
tips.forEach(function(tip){
//   console.log(tip);
  tip.addEventListener("mouseover", displayTooltip);
  tip.addEventListener("mouseout",displayTooltip);
 });
// console.log(tips);
// return tips;
}


function displayTooltip(){
  console.log(this);
let tipText= this.lastChild;
tipText.classList.toggle("hidden");
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
  //hide sign-in, show game 
  hide();
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
  let handContent =document.querySelectorAll(".hand-content");
  handContent[0].classList.add(dealer.name);
  handContent[1].classList.add(player1.name);
  //deal
  dealCards();
  console.log(player1.hand);
  displayHTMLhand(dealer);
  displayHTMLhand(player1);
  // showHand(); //console display function only
  //calculate hand values
  player1.handValue=sumValue(player1);
  dealer.handValue=sumValue(dealer);
  showValue(player1); //console only
  // showValue(dealer); //console only
  //check for naturals
  checkNatural(player1);
  setTooltip();
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
    this.hand.push(pickedCard[0]);
    // console.log(pickedCard[0]);
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


// console.log(player1.hand);
//debuggers
/*console.log(dealer.hand);
//console.log(player1.hand);
//console.log(deck);
//console.log(deck.length);*/


// create and display hand on HTML

function displayHTMLhand(player){
//console.log(player);
 
//console.log(dealerHand); 
  // let hand = document.createElement("div");
  // console.log(`${player.name}-hand`);
  let hand=document.querySelector(`.${player.name}`);
  // console.log(hand);
  hand.innerHTML=createHTMLhand(player);
  // playerHand.appendChild(hand);

};

function createHTMLhand(player){
  let html = "";
  player.hand.forEach((card,i)=>{
     // console.log(card);
    let handCard='';
    // console.log(card.name);
    if(i===0 && player.name==="Dealer" && playerStand===false){
    handCard =  `<div class="overlay-container"><img src='images/back.png' class='card'><div class='overlay'></div></div>`
    }else{
    
    handCard = `<div class="overlay-container"><div class='overlay'></div><img src='images/${card.name}.png' class='card'></div>`;
    }
    html+=handCard;
  });
  return html;
}







//console log to show Player 1 their hand and one of the Dealer's cards
function showHand(){
  // displayMessage(`The Dealer's facedown card is: ${dealer.hand[0].name}`);
  // console.log("The Dealer's facedown card is:", dealer.hand[0].name);

  var handString = "";
 
  for(var i=0; i<player1.hand.length; i++){
    handString += player1.hand[i].name + "\n";
   
  }
  displayMessage(`${player1.name}'s hand: ${handString}`);
  // console.log(player1.name +"'s hand:\n" + handString); 
}


function sumValue(person){
  var handValue = 0;
  for(var i=0; i<person.hand.length; i++){
    console.log(`Adding on ${person.name}'s hand: ${person.hand[i].value} to ${handValue}`);
    handValue += person.hand[i].value;
    person.handValue=handValue;
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
  displayMessage("Now checking for naturals...<span class='fa-container'><i class='far fa-question-circle'></i><p class='hidden tooltip'>An automatic 21</p></span>");
  console.log("Now checking for naturals...");
  if(dealer.hand[1].value==10 || dealer.hand[1].value==11) {
    displayMessage(`Since the dealer has a ${dealer.hand[1].name}, the dealer will now peek to see if the facedown card results in blackjack.`);
    console.log("Since the dealer has a " + dealer.hand[1].name + ", the dealer will now peek to see if the facedown card results in blackjack.");
    displayMessage(`Dealer's facedown card was ${dealer.hand[0].name}`); //debug
    console.log("Dealer's facedown card was ", dealer.hand[0].name); //debug
    checkBJ(dealer);
    if(dealer.blackjack){
      displayMessage(`The facedown card was ${dealer.hand[0].name}`);
      console.log("The facedown card was ", dealer.hand[0].name);
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

//add card to hand and update hand value
function addHitCard(player){
  // console.log(player);
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
  while(handValue > 21 && checkAces(person)){
    changeAces(person);
     handValue=sumValue(person);
     showValue(person);
  }
  if(handValue>21){
    displayMessage(`${person.name} has busted!`);
    console.log(person.name +" busted!");
    person.gamelost=true;
  }
}
  
function checkBJ(person){
    handValue=sumValue(person);
  if(handValue ==21){
    displayMessage(`${person.name} has blackjack!`)
    console.log(person.name +" has blackjack!");
    person.blackjack=true;
    hitbutton.setAttribute("disabled", "");
    standbutton.setAttribute("disabled", "");
  }
}


//check for aces
function checkAces(person){
  for(let i=0; i<person.hand.length; i++){
    if(person.hand[i].value===11){
      console.log("we got an ace here boys");
      console.log(`The ace is ${person.hand[i].name}`);
      return true;
    }
  }
  console.log("no aces here!");
  return false;
}

//change ace value to 1 if busted
function changeAces(person){
  console.log("starting changeAce function");
  for(let i=0; i<person.hand.length; i++){
    if(person.hand[i].value===11){
      console.log(`changing the value of ${person.hand[i].name}`);
      person.hand[i].value=1;
       return;
    }
  }
  console.log("Ending changeAce function");
}


/*If not, check if dealer's hand is 17 or over. 
Else, dealer should draw a card and run the stay function again. 
If  conditions two or three are met, display both players' hands. 
Whoever has the greater sum in hand wins.*/


//feature wishlist
//play button greyed out until name is entered
// move instructions somewhere less obtrusive
/*betting money
split and double down*/
