import Square from "../components/Squares/Squares";
import calcSquareColor from "./calcSquareColor";

export default function showBoard({squares, turn, mated, historyNum, trueNum, handleClick}) {
  const board = [];
  for (let i = 0; i < 8; i++) {
    const squareRows = [];
    for (let j = 0; j < 8; j++) {
      const copySquares = squares.slice();
      let squareColor = calcSquareColor(i, j, copySquares);
      let squareCursor;
      if (copySquares[i * 8 + j].player === turn)
        squareCursor = "pointer";

      if (mated) squareCursor = "default";
      if (historyNum - 1 !== trueNum)
        squareCursor = "not_allowed";

      squareRows.push(
        <Square
          key={i * 8 + j}
          value={copySquares[i * 8 + j]}
          color={squareColor}
          cursor={squareCursor}
          onClick={handleClick(i * 8 + j)}
        />
      );
    }
    board.push(<div key={i}>{squareRows}</div>);
  }
  return board
}
