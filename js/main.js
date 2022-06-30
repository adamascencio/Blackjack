/*----- constants -----*/
/*----- app's state (variables) -----*/
/*----- cached element references -----*/
/*----- event listeners -----*/
/*----- functions -----*/

/*
1. Create constants 
  1a. MAX_POINTS = 21 
  1b. scores for Jack, Queen, King, Ace
  1c. MIN_BET = 5
  1d. MAX_BET = 20
  1e. BLACKJACK_PAYOUT_RATIO = 1.5 (user dealt a 10 & ace)
  1f. REGULAR_WIN_RATIO = 1

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
