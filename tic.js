var origBoard;
var currPlayer;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

var gameType;
const cells = document.querySelectorAll('.cell');
//startGame();

function menu(){
    $('#endmodal').modal('hide');
    document.querySelector("table").style.display = "none";
    //document.querySelector(".endgame").style.display = "none";
    document.querySelector(".jumbotron").style.display = "block";
}

function startGame(){
    $('#endmodal').modal('hide');
    var types = document.getElementsByName('plselect');
    for(var i = 0; i < types.length; i++){
        if(types[i].checked){
            gameType = types[i].value;
        }
    }
    //console.log(gameType);
    if(gameType == 2){
        currPlayer = huPlayer;
    }
    document.querySelector("table").style.display = "block";
    document.querySelector(".jumbotron").style.display = "none";
    //document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys())
    for(var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick, false);
    }         
}

function turnClick(square){
    if(typeof(origBoard[square.target.id]) == 'number'){
        if(gameType == 1){
            turn(square.target.id, huPlayer);
            if(!checkTie()) turn(bestSpot(), aiPlayer);
        }
        else{
            turn(square.target.id, currPlayer);
            if(!checkTie()){
                if(currPlayer == huPlayer) currPlayer = aiPlayer;
                else currPlayer = huPlayer;
            }
        }
    }
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(board, player){
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == huPlayer ? "rgba(63, 16, 173, 0.75)" : "rgba(134, 39, 39, 0.75)";
    }
    for(var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    if(gameType == 1) declareWinner(gameWon.player == huPlayer ? "You win!" : "Well, keep trying!");
    else declareWinner(gameWon.player == huPlayer ? "Player 1 wins!" : "Player 2 wins");
}

function bestSpot(){
    return minimax(origBoard, aiPlayer).index;
}

function emptySquares(board){
    /* var emptyS = [];
    for(var i = 0; i < cells.length; i++){
        if(typeof(origBoard[i]) == 'number') emptyS.concat(i);
    }
    return emptyS; */
    return board.filter(s => typeof(s) == 'number');
}

function checkTie(){
    if(emptySquares(origBoard).length == 0){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "rgba(67, 219, 92, 0.75)";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function declareWinner(who){
    // document.querySelector(".endgame").style.display = "block";
    // document.querySelector(".endgame .text").innerText = who;
    document.querySelector(".modal-body").innerText = who;
    $('#endmodal').modal('show');
}

function minimax(newBoard, player){
    var availSpots = emptySquares(newBoard);

    if(checkWin(newBoard, huPlayer)){
        return {score: -10};
    } else if(checkWin(newBoard, aiPlayer)){
        return {score: 10};
    } else if(availSpots.length === 0){
        return {score: 0};
    }
    var moves = [];
    for(var i = 0; i < availSpots.length; i++){
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if(player == aiPlayer){
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        }
        else{
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score; 
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === aiPlayer){
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else{
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];

}