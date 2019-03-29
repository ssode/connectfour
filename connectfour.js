

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

    constructor(state, parent=null, move=null) {
        this.state = state;
        this.parent = parent;
        this.children = [];
        this.move = move;
        this.win = false;
        this.sims = 0;
        this.wins = 0;
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

    isWin() {
        for (let i = 0; i < this.state.length; i++) {
            for (let j = 0; j < this.state[i].length; j++) {
                if (this.state[i][j] === 0) {
                    continue;
                }
                if (i + 3 < this.state.length && this.state[i][j] === this.state[i+1][j] && this.state[i][j] === this.state[i+2][j] && this.state[i][j] === this.state[i+3][j]) {
                    this.win = true;
                    return this.state[i][j];
                } else if (j + 3 < this.state[i].length && this.state[i][j] === this.state[i][j+1] && this.state[i][j]=== this.state[i][j+2] && this.state[i][j]=== this.state[i][j+3]) {
                    this.win = true;
                    return this.state[i][j];
                } else if (i - 3 >= 0 && this.state[i][j] === this.state[i-1][j] && this.state[i][j]=== this.state[i-2][j]&& this.state[i][j] === this.state[i-3][j]) {
                    this.win = true;
                    return this.state[i][j];
                } else if (j - 3 < this.state[i].length && this.state[i][j] === this.state[i][j-1] && this.state[i][j]=== this.state[i][j-2]&& this.state[i][j] === this.state[i][j-3]) {
                    this.win = true;
                    return this.state[i][j];
                } else if (i + 3 < this.state.length && j + 3 < this.state[i].length && this.state[i][j] === this.state[i+1][j+1] && this.state[i][j]=== this.state[i+2][j+2] && this.state[i][j]=== this.state[i+3][j+3]) {
                    this.win = true;
                    return this.state[i][j];
                } else if (i + 3 < this.state.length && j - 3 >= 0 && this.state[i][j] === this.state[i+1][j-1] && this.state[i][j]=== this.state[i+2][j-2] && this.state[i][j]=== this.state[i+3][j-3]) {
                    this.win = true;
                    return this.state[i][j];
                }
            }
        }
        return 0;
    }
    
    stateCopy() {
        const newState = [];
        for (let i = 0; i < this.state.length; i++) {
            newState[i] = [...this.state[i]];
        }
        return newState;
    }

    generateChild(move, player) {
        const newState = this.stateCopy();
        newState[move.row][move.col] = player;
        return new GameNode(newState, this, move); 
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
    console.log("");
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
    
    console.log(node.isWin());
    if (node.isWin() !== 0 || node.children.length === 0) {
        aprint(node);
        return;
    }
    player === 1 ? player = 2 : player = 1;
    expand(node.children[index]);
}

function simulate(node, count) {
    while (count > 0) {
        while (node.isWin() === 0) {
            node.sims++;
            if (node.children.length === 0)
                node.generateChildren(player);
            
            let rand = Math.floor(Math.random() * node.children.length);
            node = node.children[rand];
            player === 1 ? player = 2 : player = 1;
        }
        while (node.parent !== null) {
            node.wins++;
            node = node.parent;
        }
        count--;
    }
}

function getMove(node) {
    let best = node.children[0];
    for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].wins/node.children[i].sims > best.wins/best.sims)
            best = node.children[i];
    }
    return best;
}
