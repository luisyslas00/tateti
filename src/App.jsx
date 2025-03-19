import { useState } from "react"

const TURNOS = {
  X:'⨉',
  O:'◯'
}


//Creamos el cuadrado del tablero
const Square = ({children,isSelected,updateBoard,index})=>{
  const className = `square ${isSelected ? 'is-selected':''}`

  const handleClick = () =>{
    updateBoard(index)
  }

  return(
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

const COMBOS_WINNER = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function App() {
  //Tablero vacío de 9 posiciones, lo rellenamos con null, luego se irá rellenando al jugar
  const [board,setBoard] = useState(()=>{
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })
  //Creamos un state para saber de quién es el turno
  const [turn,setTurn] = useState(()=>{
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNOS.X
  })
  //State para el ganador, null no hay ganador, false hay empate
  const [winner,setWinner] = useState(null)

  const checkWinner = (boardToCheck) =>{
    for(const combo of COMBOS_WINNER){
      const [a,b,c] =combo
      if(boardToCheck[a]&&boardToCheck[a] ===boardToCheck[b]&&boardToCheck[a] === boardToCheck[c]){
        return boardToCheck[a]
      }
    }
    return null
  }

  //Resetamos el juego
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNOS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  //Chequear si finalizó el juego
  const checkEndGame = (newBoard) => {
    return newBoard.every((square)=>square !== null)
  }

  //Actualiza el turno
  const updateBoard = (index) =>{
    //Si en la posición ya tiene algo, no lo actualizamos
    if(board[index]||winner) return
    //Traemos el array sin modificar el original y actualizamos el valor con X o O
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNOS.X ? TURNOS.O : TURNOS.X
    setTurn(newTurn)
    //Guardar partida
    window.localStorage.setItem('board',JSON.stringify(newBoard))
    window.localStorage.setItem('turn',newTurn)
    //Revisar si hay un ganador
    const newWinner = checkWinner(newBoard)
    if(newWinner){
      setWinner(newWinner) //es asincrono
      //Chequear si hay un ganador
    }else if(checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  return(
    <main className="board">
      <h1>TA TE TI</h1>
      <button onClick={resetGame}>Resetear juego</button>
      <section className="game">
        {
          board.map((_,index)=>{
            return(
              <Square key={index} index={index} updateBoard={updateBoard}>
                {board[index]}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNOS.X}>
          {TURNOS.X}
        </Square>
        <Square isSelected={turn === TURNOS.O}>
          {TURNOS.O}
        </Square>
      </section>
      <section>
        {
          winner !== null && (
            <section className="winner">
              <div className="text">
                <h2>
                  {
                    winner === false ? 'Empate': 'Ganó:'
                  }
                </h2>
                <header className="win">
                  {winner && <Square>{winner}</Square>}
                </header>
                <footer>
                  <button onClick={resetGame}>Empezar de nuevo</button>
                </footer>
              </div>
            </section>
          )
        }
      </section>
    </main>
  )
}

export default App
