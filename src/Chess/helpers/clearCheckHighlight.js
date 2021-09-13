import { white } from "../constants/players";

export default function clearCheckHighlight(squares, player) {
  const copySquares = squares.slice();
  for (let j = 0; j < 64; j++) {
    if (copySquares[j].ascii === (player === white ? "k" : "K")) {
      copySquares[j].in_check = 0;
      break;
    }
  }
  return copySquares;
}
