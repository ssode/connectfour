

/*const ctx = document.querySelector("canvas").getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.strokeStyle = "white";
ctx.beginPath();
for (let i = 0; i < 8; i++) {
    ctx.moveTo(i * 100, 0);
    ctx.lineTo(i* 100, ctx.canvas.height);
    if (i < 7) {
        ctx.moveTo(0, i * 100);
        ctx.lineTo(ctx.canvas.width, i * 100);
    }
}
ctx.stroke();*/

const config = {
    numRows: 6,
    numCols: 7
}

class ConnectFour {

    constructor() {
        this.cellSize = 100;
    }

}

class GameNode {

    constructor(state, parent=null) {
        this.state = state;
        this.parent = parent;
        this.children = [];
    }

    getValidMoves() {
        const moves = [];
        for (let i = 0; i < this.state[0].length; i++) {
            if (this.state[0][i] === 0) {
                for (let j = this.state.length - 1; j >= 0; j--) {
                    if (this.state[j][i] === 0) {
                        moves.push({row: j, col: i});
                        break;
                    }
                }
            }
        }
        return moves;
    }
    
    stateCopy() {
        let newState = [];
        for (let i = 0; i < this.state.length; i++) {
            newState[i] = [...this.state[i]];
        }
        return newState;
    }

    generateChild(move, player) {
        let newState = this.stateCopy();
        newState[move.row][move.col] = player;
        return new GameNode(newState, this); 
    }

    generateChildren(player) {
        const moves = this.getValidMoves();
        for (let move of moves) {
            this.children.push(this.generateChild(move, player));
        }
    }

}

function aprint(node) {
    for (let i = 0; i < node.state.length; i++) {
        line = "";
        for (let j = 0; j < node.state[i].length; j++) {
            line += node.state[i][j] + " ";
        }
        console.log(line);
    }
    console.log();
}

const board = [];
for (let i = 0; i < 6; i++) {
    board[i] = [];
    for (let j = 0; j < 7; j++) {
        board[i][j] = 0;
    }
}
let node = new GameNode(board);

let player = 1;

function expand(node) {
    node.generateChildren(player);
    let index = Math.floor(Math.random() * node.children.length);
    if (node.children.length === 0)
        return;
    aprint(node.children[index]);
    player === 1 ? player = 2 : player = 1;
    expand(node.children[index]);
}
