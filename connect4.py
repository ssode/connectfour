import math
import random
import copy

# contains information about a move
class Move:

    def __init__(self, row, col):
        self.row = row
        self.col = col

    def __str__(self):
        return "({}, {})".format(self.row, self.col)

# represents an individual game state
class State:

    def __init__(self, player=1, board=None, last_move=None):
        if board is None:
            self.board = [[0 for _ in range(7)] for _ in range(6)]
        else:
            self.board = board
        self.cur_player = player
        self.last_move = last_move
        self.win_status = self.check_win()
        if self.win_status != 0:
            self.is_terminal = True
        else:
            self.is_terminal = False

    # returns the next state with the move applied to it
    def next_state(self, move):
        new_board = copy.deepcopy(self.board)
        assert isinstance(move, Move)
        new_board[move.row][move.col] = self.cur_player
        return State(3-self.cur_player, new_board, move)

    # returns valid moves from the state
    def valid_moves(self):
        moves = []
        for col in range(7):
            for row in range(5, -1, -1):
                if self.board[row][col] == 0:
                    moves.append(Move(row, col))
                    break
        return moves

    # returns the winning player if one is found, -1 if tie, 0 if the game isn't over
    # if there is a winner or tie, the states values are updated accordingly
    def check_win(self):
        empty_found = False
        for i in range(len(self.board)):
            for j in range(len(self.board[i])):
                tile = self.board[i][j]
                if tile == 0:
                    if not empty_found:
                        empty_found = True
                    continue
                try:
                    if self.board[i+1][j] == tile and self.board[i+2][j] == tile and self.board[i+3][j] == tile:
                        self.win_status = tile
                        self.is_terminal = True
                        return tile
                except IndexError:
                    pass
                try:
                    if self.board[i][j+1] == tile and self.board[i][j+2] == tile and self.board[i][j+3] == tile:
                        self.win_status = tile
                        self.is_terminal = True
                        return tile
                except IndexError:
                    pass
                try:
                    if self.board[i+1][j+1] == tile and self.board[i+2][j+2] == tile and self.board[i+3][j+3] == tile:
                        self.win_status = tile
                        self.is_terminal = True
                        return tile
                except IndexError:
                    pass
                try:
                    if self.board[i-1][j+1] == tile and self.board[i-2][j+2] == tile and self.board[i-3][j+3] == tile:
                        self.win_status = tile
                        self.is_terminal = True
                        return tile
                except IndexError:
                    pass
        if empty_found:
            return 0
        else:
            self.win_status = -1
            self.is_terminal = True
            return -1

    # prints the state in a readable way
    def __str__(self):
        line = "0 1 2 3 4 5 6\n"
        line += "-------------\n"
        for row in range(len(self.board)):
            for _, val in enumerate(self.board[row]):
                line += str(val) + " "
            line += "\n"
        return line


# a tree node for MCTS, contains scoring values
class Node:

    def __init__(self, state, parent=None):
        self.state = state
        self.parent = parent
        self.children = []
        self.score = 0
        self.visits = 0
        self.expanded = False

    # returns the UCB1 of a node, or infinity of the node's visit count is 0
    def get_ucb1(self):
        if self.visits == 0:
            return float('inf')
        else:
            return self.score/self.visits + math.sqrt(2*math.log(self.parent.visits)/self.visits)


class MCTS:

    def __init__(self, root):
        self.root = root

    # runs the specified amount of iterations of MCTS and returns the move with the most visits
    def run(self, iterations):
        for _ in range(iterations):
            node = self.root

            while node.expanded:
                node = self.select(node)

            self.expand(node)
            node = random.choice(node.children)
            winner = self.playout(node)
            self.backpropagate(node, winner)

        best_move = max(self.root.children, key=lambda n: n.visits)
        return best_move.state.last_move

    # returns the first of the node's children when sorted by highest to lowest UCB1
    def select(self, node):
        if not len(node.children) == 0:
            return sorted(node.children, key=lambda n: n.get_ucb1(), reverse=True)[0]
        else:
            return None

    # expands a node, creating all of its possible children
    def expand(self, node):
        if not node.expanded:
            for move in node.state.valid_moves():
                node.children.append(Node(node.state.next_state(move), node))
                node.expanded = True

    # plays out a random game starting from the given node
    def playout(self, node):
        our_player = self.root.state.cur_player
        temp_state = copy.deepcopy(node.state)
        while not temp_state.is_terminal:
            move = random.choice(temp_state.valid_moves())
            temp_state.board[move.row][move.col] = temp_state.cur_player
            temp_state.cur_player = 3 - temp_state.cur_player
            temp_state.check_win()
        return temp_state.win_status

    # propagates the information from the playout back up the tree
    def backpropagate(self, node, winner):
        while node is not None:
            if node.state.cur_player == 3-winner:
                node.score += 1
            node.visits += 1
            node = node.parent


# start a new game with the player as 1 and AI as 2
if __name__ == "__main__":
    num_itr = int(input("Enter the max number of iterations for MCTS: "))
    state = State()
    while not state.is_terminal:
        print(str(state))
        if state.cur_player == 1:
            col = int(input("Enter a column: "))
            for move in state.valid_moves():
                if move.col == col:
                    state = state.next_state(move)
                    break
        else:
            move = MCTS(Node(state)).run(num_itr)
            print("AI chooses column {}".format(move.col))
            state = state.next_state(move)
    print(str(state))
    print("Player {} wins!".format(state.win_status))

    







