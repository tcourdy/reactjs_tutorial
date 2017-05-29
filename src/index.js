import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    if(props.isWinner) {
        return(
            <button className="winning-square" onClick={() => props.onClick()}>
            {props.value}
            </button>
        );
    } else {
        return(
            <button className="square" onClick={() => props.onClick()}>
            {props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i, isWinner) {
        return (
            <Square
            value={this.props.squares[i]}
            isWinner={isWinner}
            onClick={() => this.props.onClick(i)}
            />
        );
    }
    
    render() {
        const winningIndices = this.props.winningLine;
        var squares = [];
        for(var i = 0; i < 3; i++) {
            let row = [];
            for(var j = (i * 3); j < (3 * (i+1)); j++) {
                if(winningIndices.indexOf(j) !== -1) {
                    row.push(<span key={j}> {this.renderSquare(j, true)}</span>);                    
                } else {
                    row.push(<span key={j}> {this.renderSquare(j, false)}</span>);                    
                }
            }
            squares.push(<div key={i} className="board-row">{row}</div>);
        }

        return (
            <div>
            {squares}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        if (winner.letter || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true
        });
    }

    createMoveDescript(prevState, currState) {
        for(var i = 0; i < prevState.length; i++) {
            if(prevState[i] !== currState[i]) {
                if(i < 3) {
                    return "(1, " + ((i % 3) + 1) + ")";
                } else if (i < 6) {
                    return "(2, " + ((i % 3) + 1) + ")";
                } else {
                    return "(3, " + ((i % 3) + 1) + ")";
                }
            }
        }
    }

    toggleSort() {
        let isAscending = this.state.isAscending;
        this.setState({
            isAscending: !isAscending
        });
    }

    createJsxMove(step, move, history) {
        var moveDescript = "";
        if(move) {
            var prevState = history[move - 1];
            moveDescript = "Move" + this.createMoveDescript(prevState.squares,
                                                            step.squares);
        } else {
            moveDescript = "Game start";
        }
        var desc = "";
        if(move === this.state.stepNumber) {
            desc = <b>{moveDescript}</b>;
        } else {
            desc = moveDescript;
        }

        return (
            <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
            </li>
        );
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        var moves = [];
        
        if(this.state.isAscending) {
            moves = history.map(this.createJsxMove, this);
        } else {
            for(var i = history.length - 1; i >= 0; i--) {
                moves.push(this.createJsxMove(history[i], i, history));
            }
        }
        
        let status;
        if(winner.letter) {
            status = "Winner: " + winner.letter;  
        } else {
            status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
            <div className="game-board">
            <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningLine={winner.indices}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <button onClick={() => this.toggleSort()}>Asc/Desc History </button>
            </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let winner = {letter: null, indices: []}
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//            return squares[a];
            // return lines[i];
            winner.letter = squares[a];
            winner.indices = lines[i];
            return winner;
        }
    }
    return winner;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
