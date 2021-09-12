export default function highlightMate(
  player,
  squares,
  checkMated,
  staleMated
) {
  const copySquares = squares.slice();
  if (checkMated || staleMated) {
    for (let j = 0; j < 64; j++) {
      if (copySquares[j].ascii === (player === "w" ? "k" : "K")) {
        copySquares[j].checked = checkMated === true ? 1 : 2;
        break;
      }
    }
  }
  return copySquares;
}
