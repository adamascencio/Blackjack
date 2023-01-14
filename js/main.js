/*----- constants -----*/
const SUITS = ['h', 'd', 's', 'c'];
const VALUES = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
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
let bankRollContainer = document.getElementById('buy-chips-container');
let bankRollEl = document.getElementById('b-roll');
let bankRollInput = document.getElementById('buy-chips');
let betEl = document.getElementById('bet');
let playBtns = document.getElementById('play-button-row');
let betBtns = document.getElementById('bet-button-row');
let pScoreEl = document.getElementById('p-score');
let dScoreEl = document.getElementById('d-score');
let dealBtn = document.getElementById('d-button');
let hitBtn = document.getElementById('h-button');
let standBtn = document.getElementById('s-button');
let playerHandEl = document.getElementById('player-hand');
let dealerHandEl = document.getElementById('dealer-hand');

/*----- event listeners -----*/
document.getElementById('add-to-bank-roll').addEventListener('click', handleBuyChipsClick);
bankRollContainer.addEventListener('click', handleBankRollClick);
betBtns.addEventListener('click', handleBetClick);
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
  bankRollEl.textContent = `$${bankRoll}`;
  betEl.textContent = `$${bet}`;
  renderHands();
  renderButtons();
  renderWinner();
}

function renderHands() {
  pScoreEl.textContent = pScore;
  (gameStatus === false) ? dScoreEl.textContent = dScore : dScoreEl.textContent = '??';
  playerHandEl.innerHTML = pHand.map(cardObj => `<div style="flex-shrink:1" class="card ${cardObj.face} large"></div>`).join('');
  dealerHandEl.innerHTML = dHand.map(cardObj => `<div style="flex-shrink:1" class="card ${cardObj.back && gameStatus ? 'back' : cardObj.face} large"></div>`).join('');
}

function renderButtons() {
  dealBtn.style.display = (!gameStatus && bet > 0) ? 'inline' : 'none';
  hitBtn.style.display = standBtn.style.display = gameStatus ? 'inline' : 'none';
  betBtns.style.display = gameStatus ? 'none': '';
  playBtns.style.margin = bet > 0 ? '0 auto 30px auto' : '0';
}

function renderWinner() {
  document.querySelector('h2').textContent = DISPLAY_WINNER[winner];
}

function handleBuyChipsClick() {
  bankRollContainer.classList.toggle('hidden');
}

function handleBankRollClick(evt) {
  const btn = evt.target.id; 
  // guards
  if (gameStatus === true) return;
  if (btn === 'buy-btn') {
    if (parseInt(bankRollInput.value) > 0) {
      bankRoll += parseInt(bankRollInput.value);
      bankRollInput.value = '';
      render();
      bankRollContainer.classList.toggle('hidden');
    }
  } else if (btn === 'cancel-btn') {
    bankRollContainer.classList.toggle('hidden');
  }
}

function handleBetClick(evt) {
  const btn = evt.target;
  // guards
  if (btn.tagName !== 'BUTTON' ||  // make sure the button was clicked
      gameStatus === true          // only allow clicks while game is inactive
      ) return;
  const betAmt = parseInt(evt.target.textContent.substring(1));
  bet += betAmt;
  bankRoll -= betAmt;
  render();
}

function handleDealClick() {
  gameStatus = true;
  pScore = dScore = 0;
  winner = null;
  deck = shuffleDeck();
  dHand = [];
  pHand = [];
  dHand.push(deck.pop(), deck.pop());
  pHand.push(deck.pop(), deck.pop());
  dHand[1].back = true;
  dScore = getScore(dHand);
  pScore = getScore(pHand);
  if (pScore === 21) {
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

function handleStandClick() {
  handleDealerHit();
}

function handleDealerHit() {
  renderHands();
  setTimeout(function() {
    if (dScore < 17) {
      dHand.push(deck.pop());
      dScore = getScore(dHand);
      handleDealerHit();
    } else {
      getWinner();
      payWinner();
      render();
    }
  }, 2000);
}

function getWinner() {
  // check for blackjack
  if (pHand.length === 2) {
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
    return dHand.length === 2 ? winner = 'dbj' : winner = 'd';
  } else if (dScore > pScore) {
    return winner = 'd';
  } else if (pScore > dScore) {
    return winner = 'p';
  }
}

function shuffleDeck() {
  const deck = ORIGINAL_DECK.slice(); // copy the original deck
  const shuffledDeck = [];
  while (deck.length > 0) {
    const randIdx = Math.floor(Math.random() * deck.length);
    shuffledDeck.push(deck.splice(randIdx, 1)[0]); 
  }
  return shuffledDeck;
}

function createDeck() {
  const deck = [];
  for (let suit of SUITS) {
    for (let num of VALUES) {
      deck.push({
        face: `${suit}${num}`,
        value: Number(num) || (num === 'A' ? 0 : 10),
        back: false
      });
    }
  }
  return deck;
}

function getScore(handArr) {
  let score = 0;
  let aceCount = 0;
  handArr.forEach(function(card) {
    score += card.value;
    if (card.value === 0) aceCount++;
  });
  for (let i = 0; i < aceCount; i++) {
    (21 - score >= 11) ? score += 11 : score += 1;
  }
  return score;
}

function payWinner() {
  if (winner === 'pbj') {
    bankRoll += bet + (bet * 1.5);
  } else if (winner === 't') {
    bankRoll += bet;
  } else if (winner === 'p') {
    bankRoll += bet * 2;
  } 
  bet = 0;
  gameStatus = false;
  dHand.forEach(card => card.back = false);
}
