/* jshint esversion: 11 */

// Wait for the DOM to finish loading before running functions
document.addEventListener("DOMContentLoaded", function () {

    runGame();
});

/**
 * Game container function
 */
function runGame() {
    let flippedCards = []; //Store flipped cards
    let boardLocked = false; //Cards are clickable
    let matchedPairs = 0; //Track number of matched pairs

    //Sound effects
    const matchSound = new Audio("assets/sounds/match.mp3");
    const winSound = new Audio("assets/sounds/win.mp3");

    document.getElementById("win-modal").classList.add("hidden");

    //Store card details
    const cardData = [
        { src: "assets/images/barn.webp", alt: "barn" },
        { src: "assets/images/cow.webp", alt: "cow" },
        { src: "assets/images/farmer.webp", alt: "farmer" },
        { src: "assets/images/horse.webp", alt: "horse" },
        { src: "assets/images/sheep.webp", alt: "sheep" },
        { src: "assets/images/tractor.webp", alt: "tractor" },
    ];

    //Duplicate the set of cards
    let cards = [...cardData, ...cardData];

    //Shuffle the cards
    shuffle(cards);

    const gameCards = document.querySelectorAll(".game-card");

    gameCards.forEach(function (cardEl, index) {
        const card = cards[index];

        // Remove any existing listeners by cloning the element - Solution provided by Claude.ai
        const newCardEl = cardEl.cloneNode(true);
        cardEl.parentNode.replaceChild(newCardEl, cardEl);

        newCardEl.dataset.card = card.alt;

        const cardImg = newCardEl.querySelector(".card-flip-back img");
        cardImg.src = card.src;
        cardImg.alt = card.alt;

        //Apply event listener to cards & activate flip 
        newCardEl.addEventListener("click", function () {
            if (boardLocked || this.classList.contains("flipped")) {
                return;
            }

            //Flip the card
            this.classList.add("flipped");
            flippedCards.push(this);

            //Check if 2 cards are flipped
            if (flippedCards.length === 2) {
                boardLocked = true; //lock the board
                checkMatch();
            }
        });

    });


    /**
    * Check it the 2 flipped cards match
    */
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.card === card2.dataset.card;

        if (isMatch) {
            //Cards match - keep them flipped
            matchSound.play();
            matchedPairs++;

            flippedCards = [];
            boardLocked = false;

            //Check if all cards matched
            if (matchedPairs === 6) {
                setTimeout(function() {
                    winSound.play();
                }, 500);  
                document.getElementById("win-modal").classList.replace("hidden", "fade-in-out");
                setTimeout(function() {
                document.getElementById("win-modal").classList.replace("fade-in-out", "hidden");
                }, 7000);              
            }
        } else {
            //No match - flip cards back
            
            setTimeout(function () {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                flippedCards = [];
                boardLocked = false;
            }, 1000);
        }
    }

    //Apply event listener to game reset button
    let gameBtn = document.getElementById("game-reset");

    gameBtn.addEventListener("click", resetGame, { once : true});

}

/**
 * Shuffle the array and therefore the cards to randomise each time
 */
//Fisher-Yates algorithm method
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Reset the game to play again
 */
function resetGame() {
    //Flip all cards back "face-down"
    const gameCards = document.querySelectorAll(".game-card");
    gameCards.forEach(function (card) {
        card.classList.remove("flipped");
    });

    document.getElementById("win-modal").className = ("d-flex flex-column hidden");
    setTimeout(runGame, 1000);
}