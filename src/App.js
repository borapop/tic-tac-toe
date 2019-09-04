import React, { useState } from 'react';
import './App.css';
import Field, { FIELD_SOURCES } from './components/Field'

export const X = 'x'
export const O = 'o'
export const FIELD_VALUES = [X, O]

function getInitialBoard(dimension) {
  const result = []
  for (let i = 0; i < dimension; i++) {
    const row = []
    for (let j = 0; j < dimension; j++) {
      row.push(null)
    }
    result.push(row)
  }
  return result
}

function getInitialPlayers() {
  return [
    { name: 'player1' },
    { name: 'player2' }
  ]
}

function getQuarterDiagonals(rows) {
  const size = rows.length
  const result = []
  for (let initialIndex = 0; initialIndex < size; initialIndex++) {
    const diagonal = []
    for (let i = 0; i < size; i++) {
      if (typeof rows[i][initialIndex + i] === 'undefined') {
        break
      }
      diagonal.push(rows[i][initialIndex + i])
    }
    result.push(diagonal)
  }
  return result
}

function findWinSequence(rows, itemsToWin) {
  const size = rows.length
  let allSequences = []
  rows.forEach(row => allSequences.push(row))
  const columns = []
  for (let j = 0; j < size; j++) {
    columns.push([])
    for (let i = 0; i < size; i++) {
      columns[j][i] = rows[i][j]
    }
  }
  columns.forEach(column => allSequences.push(column))
  allSequences = [
    ...allSequences,
    ...getQuarterDiagonals(rows),
    ...getQuarterDiagonals(rows.reverse()),
    ...getQuarterDiagonals(columns),
    ...getQuarterDiagonals(columns.reverse()),

  ]
  console.log(allSequences)
  for (let i = 0; i < allSequences.length; i++) {
    let sequenceFound = false
    let itemType = null
    let counter = 0
    for (let j = 0; j < allSequences[i].length; j++) {
      const item = allSequences[i][j]
      const nextItem = allSequences[i][j + 1]
      if (item !== null) {
        if (item === nextItem) {
          itemType = item
          counter++
        }
      } else {
        itemType = null
        counter = 0
      }
      if (counter >= itemsToWin - 1) {
        sequenceFound = true
        break
      }
    }
    if (sequenceFound) {
      return itemType
    }
  }
  return null
}

function App() {
  const boardDimension = 10
  const [players, setPlayers] = useState(getInitialPlayers())
  const [sequenceToWin, setSequenceToWin] = useState(3)
  const [whoMovesIndex, setWhoMovesIndex] = useState(0)
  const [winner, setWinner] = useState(null)
  const [board, setBoard] = useState(getInitialBoard(boardDimension))

  function handleFieldClick({ n, m }) {
    if (winner !== null) return
    const newBoard = [...board]
    newBoard[n][m] = whoMovesIndex
    setWhoMovesIndex(whoMovesIndex === players.length - 1 ? 0 : whoMovesIndex + 1)
    setBoard(newBoard)
    const foundWinner = findWinSequence(board, sequenceToWin)
    if (foundWinner !== null) {
      setWinner(foundWinner)
    }
  }

  function startNewGame() {
    setBoard(getInitialBoard(boardDimension))
    setPlayers(getInitialPlayers())
    setWinner(null)
  }

  function handleModeChange(e) {
    setSequenceToWin(e.target.value)
    startNewGame()
  }

  return (
    <div className="App">
      <div className="game-status-row">
        <div className="game-status-row__who-moves">
          <img
            src={FIELD_SOURCES[whoMovesIndex]}
            className="game-status-row__who-moves-icon"
            alt="field"
          />
          goes
        </div>
        <div className="game-status-row__mode-select-row">
          Number to win:
          <select onChange={handleModeChange}>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <a href="#" onClick={startNewGame}>
          New Game
        </a>
      </div>
      <div className="board-wrapper">
        <div className="board">
          {
            winner !== null &&
            <div className="board__winner">
              <img
                src={FIELD_SOURCES[winner]}
                className="board__winner-img"
                alt="field"
              />
              WINS!
            </div>
          }
          {board.map((boardRow, n) =>
            <div
              key={n}
              style={{ height: `${100 / boardDimension}%` }}
              className="board-row"
            >
              {boardRow.map((field, m) =>
                <Field
                  key={m}
                  value={field}
                  whoMovesIndex={whoMovesIndex}
                  onClick={() =>
                    board[n][m] === null &&
                    handleFieldClick({ n, m })
                  }
                />
              )}
            </div>)}
        </div>
      </div>
    </div>
  );
}

export default App;
