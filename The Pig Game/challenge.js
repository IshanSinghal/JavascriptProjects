/*
CHALLENGES
1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/

var scores, roundScore, activePlayer, dice1, dice2, gameon, lastDice;

newGame();

document.querySelector('.btn-roll').addEventListener('click', function(){
    if(gameon)
    {
    dice1 = Math.floor(Math.random() * 6) + 1;
    dice2 = Math.floor(Math.random() * 6) + 1;
        
    document.getElementById('dice-1').style.display = 'block';
    document.getElementById('dice-2').style.display = 'block'; 
    document.getElementById('dice-1').src = 'dice-'+dice1+'.png';
    document.getElementById('dice-2').src = 'dice-'+dice2+'.png';
    /*    
    if(dice === 6 && lastDice === 6)
        {
            //lose full score
            scores[activePlayer] = 0;
            document.querySelector('#score-'+activePlayer).textContent = '0';
            nextPlayer();
        }
    else if(dice !== 1){
        //ADD SCORE
        roundScore += dice;
        document.querySelector('#current-'+activePlayer).textContent = roundScore;
        }
    else
        {
            //NEXT PLAYER
            nextPlayer();
        }
    lastDice = dice;
    */
        
    /********CHALLENGE 3 *********/
    if(dice1 !== 1 && dice2 !== 1)
        {
        //ADD SCORE
        roundScore += dice1 + dice2;
        document.querySelector('#current-'+activePlayer).textContent = roundScore;
        }
    else
        {
            //NEXT PLAYER
            nextPlayer();
        }
    }
    
});


document.querySelector('.btn-hold').addEventListener('click', function(){
    if(gameon)
    {
    scores[activePlayer] += roundScore;
    document.querySelector('#score-'+activePlayer).textContent = scores[activePlayer];
    
    var input = document.querySelector('.final-score').value;
    var winningScore;
    
    if(input)
        winningScore = input;
    else//0, undefined, null, ""
        winningScore = 100;
        
    if(scores[activePlayer] >= winningScore)
        {
            document.querySelector('#name-'+activePlayer).textContent = 'WINNER!';
            document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
            document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
            gameon = false;
        }
    else
        nextPlayer();
    lastDice = 0;
    }
});



function nextPlayer(){
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
    lastDice = 0;
    document.querySelector('#current-0').textContent = '0';
    document.querySelector('#current-1').textContent = '0';
            
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
            
    document.querySelector('.dice').style.display = 'none';
}

function newGame(){
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    gameon = true;
    lastDice = 0;
    
    document.querySelector('#score-0').textContent = '0';
    document.querySelector('#score-1').textContent = '0';
    document.querySelector('#current-0').textContent = '0';
    document.querySelector('#current-1').textContent = '0';

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
    document.querySelector('#name-0').textContent = 'Player 1';
    document.querySelector('#name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
}

document.querySelector('.btn-new').addEventListener('click', function(){
    
    newGame();
    
});















