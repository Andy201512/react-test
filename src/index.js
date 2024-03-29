import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.highlight}` } onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let highlight = '';
    if( this.props.highight && this.props.highight.includes(i)){
      highlight = 'highight-square'
    }  
    return (
      <Square 
        key={i}
        value={ this.props.squares[i] }
        onClick={() => { this.props.onClick(i) }}
        highlight={highlight}
      />
    );
  }

  render() {
    const rows = Array(3).fill(null).map((value, row_index) => {
      const cols = Array(3).fill(null).map((value, col_index) => {
        return this.renderSquare( 3 * row_index + col_index )
      }) 
      return (
        <div className="board-row" key={row_index}>
          { cols }
        </div>
      )
    });
    return (
      <div>
        { rows }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        clickAxis: Array(2).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const clickAxis = calculateAxis(i);
    if(calculateWinner(squares).winner || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares,
        clickAxis:clickAxis,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeOrder(){
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const calculateWinnerResult = calculateWinner(current.squares);
    const winner = calculateWinnerResult.winner;
    const highight = calculateWinnerResult.lines;

    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move + ', clicked (' + step.clickAxis.toString() + ')' :
        'Go to game start';
      return (
        <li key={ move }>
          <button onClick={ () => this.jumpTo(move) } className={ this.state.stepNumber === move ? "clicked-li" : "" }>{ desc }</button>
        </li>
      )
    });

    if(!this.state.isAscending){
      moves.reverse()
    }

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }else if(this.state.stepNumber === 9){
      status = 'Draw!'
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highight={highight}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={() => this.changeOrder()}>{ this.state.isAscending ? '转为倒序' : '转为正序'}</button>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================
// 挂载react组件
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);

// 判断胜利函数
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], lines: lines[i]};
    }
  }
  return {winner: null, lines: null};
}

// 通过序号生成坐标函数
function calculateAxis(i){
  const axis = [
    [0,0],
    [0,1],
    [0,2],
    [1,0],
    [1,1],
    [1,2],
    [2,0],
    [2,1],
    [2,2],
  ]
  return axis[i]
}
