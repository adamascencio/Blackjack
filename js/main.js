/*----- constants -----*/
const MAX_POINTS = 21;
const SUITS = ['h', 'd', 's', 'c'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
const ORIGINAL_DECK = createDeck();

/*----- app's state (variables) -----*/
let bankRoll; // player's starting cash amount
let bet; // player's current bet
let pScore, dScore; // score of player's (p) and dealer's (d) hand 
let pHand, dHand; // hand of player (p) and dealer (d)
let deck; // array of randomly shuffled 52-card deck;
let winner; // player (p), player blackjack (pbj), dealer (d), or tie (t)
let gameStatus; // true if game is active, false if game is inactive

/*----- cached element references -----*/
let bankRollEl = document.getElementById('b-roll');
let betEl = document.getElementById('bet');
let playBtns = document.getElementById('play-button-row');
let betBtns = document.getElementById('bet-button-row');
let scoreEl = document.getElementById('p-score');
let dealBtn = document.getElementById('d-button');
let hitBtn = document.getElementById('h-button');
let standBtn = document.getElementById('s-button');

/*----- event listeners -----*/
document.getElementById('bet-button-row').addEventListener('click', handleBetClick);
dealBtn.addEventListener('click', handleDealClick);
hitBtn.addEventListener('click', handleHitClick);


/*----- functions -----*/
init(); 

// initialize the game, then call render
function init() {
  bankRoll = 500;
  bet = 0;
  pScore = dScore = 0;
  pHand = []; 
  dHand = [];
  winner = null;
  gameStatus = false;
  render();
}

// Render the game state to the DOM
function render() {
  bankRollEl.textContent = bankRoll;
  betEl.textContent = bet;
  scoreEl.textContent = pScore;
  renderButtons();
}

function renderButtons() {
  dealBtn.style.display = (!gameStatus && bet > 0) ? 'inline' : 'none';
  hitBtn.style.display = standBtn.style.display = gameStatus ? 'inline' : 'none';
  betBtns.style.visibility = gameStatus ? 'hidden': 'visible';
}

function handleBetClick(evt) {
  const btn = evt.target;
  // guards
  if (btn.tagName !== 'BUTTON' ||  // make sure the button was clicked
      gameStatus === true          // only allow clicks while game is inactive
      ) return;
  const betAmt = parseInt(btn.textContent.replace('$', ''));
  bet += betAmt;
  bankRoll -= betAmt;
  render();
}

function handleDealClick() {
  gameStatus = true;
  deck = shuffleDeck();
  dHand = [];
  pHand = [];
  dHand.push(deck.pop(), deck.pop());
  pHand.push(deck.pop(), deck.pop());
  dScore = getScore(dHand);
  pScore = getScore(pHand);
  if (dScore === 21 && pScore === 21) {
    winner = 't';
  } else if (pScore === 21) {
    winner = 'pbj';
  } else if (dScore === 21) {
    winner = 'd';
  }
  if (winner === 'pbj' || winner === 't') payWinner(winner); 
  render();
}

function handleHitClick() {
  pHand.push(deck.pop());
  pScore = getScore(pHand);
  if (pScore > 21) {
    winner = 'd';
    payWinner(winner);
  }
  render();
}

function shuffleDeck() {
  const deck = ORIGINAL_DECK.slice(); // copy the original deck
  const tempDeck = [];
  while (deck.length > 0) {
    const randIdx = Math.floor(Math.random() * deck.length);
    tempDeck.push(deck.splice(randIdx, 1)[0]); // splice returns an array, use [0] to access the first element of the array
  }
  return tempDeck;
}

function createDeck() {
  const deck = [];
  for (let suit of SUITS) {
    for (let num of VALUES) {
      deck.push(`${num}${suit}`);
    }
  }
  return deck;
}

function getScore(handArr) {
  let score = 0;
  let aces = 0;
  handArr.forEach(function(card) {
    if (Number.isInteger(parseInt(card[0]))) {
      score += parseInt(card[0]);
    } else if (card[0] === 'j' || card[0] === 'q' || card[0] === 'k') {
      score += 10;
    } else {
      aces++;
    }
  });
  aces = (MAX_POINTS - score >= 11) ? aces *= 11 : aces *= 1;
  return score + aces;
}

function payWinner(string) {
  if (string === 'pbj') {
    bankRoll += bet + (bet * 1.5);
  } else if (string === 't') {
    bankRoll += bet;
  } else if (string === 'p') {
    bankRoll += bet * 2;
  } 
  bet = pScore = 0;
  gameStatus = false;
}



/*
2. Create data structures to represent the following aspects of the game 
  2a. The 4-suit, 52 card deck
  2b. Players (house and player)
    2.b.1. Data structures should hold player ID, score (max 21), hand, wager (player only)

3. Game Logic
initialize a winnings variable to store wagers by user
create a randomly shuffled deck array upon click of play button
pop from the deck to create hands of 2 cards each for both the player and house
ask user how much they'd like to wager (5-20)
display one of the house's cards to the user
  sum points for cards dealt to house
display user's hand 
  sum points for cards dealt to player
  if user scored 21 on the draw
    user wins, pay 1.5 times wager 
ask user whether they want to hit or stay
  if hit
    pop a card from our deck
    add to current score
    if score > 21
      winnings -= wager
    if card is ace and MAX_POINTS - score < 11
      ace = 1
    else 
      ace = 11
  if stay
    greater score between player & house wins
    if player wins
      winnings += wager
    if house wins
      winnings -= wager
ask user to select play button if they'd like to continue playing      
*/
