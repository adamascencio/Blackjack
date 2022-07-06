/*----- constants -----*/
const SUITS = ['h', 'd', 's', 'c'];
const VALUES = ['02', '03', '0', '05', '06', '07', '08', '09', '10', 'j', 'q', 'k', 'a'];
const ORIGINAL_DECK = createDeck();
const DISPLAY_WINNER = {
  null: 'Ready to test your luck?',
  p: 'Player wins!',
  d: 'Dealer wins!', 
  t: "It's a tie! Player keeps his bet.", 
  pbj: 'Player hit Blackjack! Player wins!',
  dbj: 'Dealer hit Blackjack! Dealer wins!'
}

/*----- app's state (variables) -----*/
let bankRoll; // player's starting cash amount
let bet; // player's current bet
let pScore, dScore; // score of player's (p) and dealer's (d) hand 
let pHand, dHand; // hand of player (p) and dealer (d)
let deck; // array of randomly shuffled 52-card deck;
let winner; // player (p), player blackjack (pbj), dealer (d), dealer blackjack (dbj), or tie (t)
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
standBtn.addEventListener('click', handleStandClick);

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
  renderWinner();
}

function renderButtons() {
  dealBtn.style.display = (!gameStatus && bet > 0) ? 'inline' : 'none';
  hitBtn.style.display = standBtn.style.display = gameStatus ? 'inline' : 'none';
  betBtns.style.visibility = gameStatus ? 'hidden': 'visible';
}

function renderWinner() {
  document.querySelector('h2').textContent = DISPLAY_WINNER[winner];
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
  winner = null;
  gameStatus = true;
  deck = shuffleDeck();
  dHand = [];
  pHand = [];
  dHand.push(deck.pop(), deck.pop());
  pHand.push(deck.pop(), deck.pop());
  dScore = getScore(dHand);
  pScore = getScore(pHand);
  if (pScore === 21 || dScore === 21){
    getWinner();
    payWinner();
  };
  render();
}

function handleHitClick() {
  pHand.push(deck.pop());
  pScore = getScore(pHand);
  if (pScore >= 21) {
    getWinner();
    payWinner();
  }
  render();
}

function handleDealerHit() {
  if (dScore <= 16) {
    dHand.push(deck.pop());
    dScore = getScore(dHand);
  }
  render();
}

function handleStandClick() {
  handleDealerHit();
  getWinner();
  payWinner();
  render();
}

function getWinner() {
  // check for blackjack
  if (pHand.length === 2 || dHand.length === 2) {
    if (dScore === 21 && pScore === 21) {
      return winner = 't';
    } else if (pScore === 21) {
      return winner = 'pbj';
    } else if (dScore === 21) {
      return winner = 'dbj';
    }
  }
  // get winner on hit or stand
  if (dScore > 21) {
    return winner = 'p';
  } else if (pScore > 21) {
    return winner = 'd';
  } else if (dScore === pScore) {
    return winner = 't';
  } else if (pScore === 21) {
    return winner = 'p';
  } else if (dScore === 21) {
    return winner = 'd';
  } else if (dScore > pScore) {
    return winner = 'd';
  } else if (pScore > dScore) {
    return winner = 'p';
  }
}

function shuffleDeck() {
  const deck = ORIGINAL_DECK.slice(); // copy the original deck
  const tempDeck = [];
  while (deck.length > 0) {
    const randIdx = Math.floor(Math.random() * deck.length);
    tempDeck.push(deck.splice(randIdx, 1)[0]); 
  }
  return tempDeck;
}

function createDeck() {
  const deck = [];
  for (let suit of SUITS) {
    for (let num of VALUES) {
      deck.push({
        face: `${suit}${num}`,
        value: Number(num) || (num === 'a' ? 0 : 10),
        back: false
      });
    }
  }
  return deck;
}

function getScore(handArr) {
  let score = 0;
  let aces = 0;
  handArr.forEach(function(card) {
    score += card.value;
    if (card.value === 0) aces++;
  });
  aces = (21 - score >= 11) ? aces *= 11 : aces *= 1;
  return score + aces;
}

function payWinner() {
  if (winner === 'pbj') {
    bankRoll += bet + (bet * 1.5);
  } else if (winner === 't') {
    bankRoll += bet;
  } else if (winner === 'p') {
    bankRoll += bet * 2;
  } 
  bet = pScore = dScore = 0;
  gameStatus = false;
}
