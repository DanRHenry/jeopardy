Jeopardy Game
In this project, we will be completing the functionality for our Jeopardy / quiz game utilizing what we learned this week!

The game of Jeopardy consists of several players that compete to earn points by selecting questions of varying points values from a board. The board is a 6 X 6 square with each column representing a category, and the first row containing the titles of each category, and every row after being increasingly difficult questions (with correspondingly higher point values) for their categories

You will be given placeholder data for this project in the form of an array of objects.

Stories
Ready, Set, Go!
Given the players are on the landing page

When one player clicks the 'Start Game' button

<!-- Then the players redirected to the Round 1 page -->

Start the Game
Given the players have been redirected to the Round 1 page

When the page loads

<!-- Then there is a notification that it is player 1's turn to choose -->

And the "Guess", "Pass", and "Round 2" buttons are disabled

Select a Question
Given an empty board, and player 1 is currently up

When player 1 selects a card

<!-- Then the score on the card is replaced by a question -->

And the "Submit Answer" button is enabled

And the "Pass Question" button is enabled
<!-- 
How to enable and disable a button.

Tried Creating and disabling an event listener, with mixed success. 
The best I got was to enable it but then disable it after one click.

Maybe use a display none to hide the element until allowed?
 -->


Pass a Question
Given a question has been chosen

When the user clicks on the "Pass Question" button

Then player 2 gets an opportunity to answer the question

And the notification area changes to player 2's turn

<!-- 
Created a switch player function, which looks at the active player, and switches to the other.
Currently not working well.
 -->

Answer a Question Correctly
Given a question has been chosen

When the player submits an answer

And the answer is correct

Then the game awards the player the amount of points that were on the card

And the card is blanked out

And the current player does not change

<!-- 
Made a function that adds or subtracts a fixed amount of points to player one's score.
Tie this into the point value of the card clicked on.

Cards blank out fine.
 -->


Answer a Question Incorrectly

Given a question has been chosen

When the player submits an answer

And the answer is incorrect

Then the game subtracts the point total from the player's score

And the other player gets a chance to answer the question

<!-- 
Subtraction from player1's score works. Tie into the active player instead.
Switching active player doesn't currently work.

 -->


And if no one guesses correctly the original player gets to choose a new question

<!-- 
Implement this.
 -->

Score Board
Given the game has been started

When the score changes

Then the game should display each player's current score on the page
<!-- 
Works
Maybe later, push into session storage, 
and maybe later, store high scores in local storage.
 -->

Only Allow One Question
Given a card has already been selected

When the player tries to pick a new card

Then the question does not change
<!-- 
Other cards are blocked by the textbox that pops up when a card is clicked.
Need to figure out how to disable the card that has been clicked so it cannot be clicked again later.
 -->

And the game alerts the player that they must answer, or pass the question
<!-- 
The game blocks other questions, so doesn't ask this.
 -->

End Round 1
Given that the score of one user reaches 15,000 points.

Or the board has been cleared

Then the game alerts the players to move on to Round 2.
<!-- 
Add this point check, or answerboard check
 -->

And the "Round 2" button becomes enabled

And the "Round 2" button navigates to the Round 2 page.

Hint: You can use query parameters in the URL to pass score information between pages

Round 2
Given the players are on the Round 2 Page

Then the players scores are the same as they were at the end of Round 1.

And the game logic behaves as Round 1.

And the "Final Round" button is disabled

End Round 2
Given that the score of one user reaches 30,000 points.
<!-- 

Change logic to 30,000 cap

 -->
Or the board has been cleared

Then the game alerts the players to move on to the Final Round.

And the "Final Round" button becomes enabled

And the "Final Round" button navigates to the Final Round page.

Final Round
Given the players are on the Final Round page

Then they should be presented with a category

And prompted to make a wager up to their maximum point total
<!-- 
Jeopardy has a rule for dealing with player scores in the negative entering final jeopardy. 
Should it end the game and declare a winner, or loan "money" to bet?
 -->

Let's Make a Wager!
Given we're on the Final Round page

When all players have made a wager

<!-- Store bets in variables -->

Then the question is revealed

And all players get a chance to answer the question before the answer is revealed

Winning the Game
Given all players have answered the final question

When the last answer is submitted

Then the amount wagered is added or subtracted from the total score

And the game should notify the users who won based on the final score

Icebox
Say my Name!
Given the the user is on the landing page

When the user clicks "Start Game"

Then the game should allow the user(s) to set their player names

And should use those names throughout the game
<!-- 
Done
 -->

Random Questions
Given a game has been started

When the board is generated

Then the board has questions different from the placeholder data

Daily Double
Given a game is started

When the board is generated

Then two random questions should be set as the "Daily Double" and are worth twice the amount of points on their cards

<!-- 
Do this later.
 -->
Try to Make Fetch Happen
Given a game is started

When the board is generated

Then the board has questions fetched from an external API

<!-- 
Working on this.
 -->