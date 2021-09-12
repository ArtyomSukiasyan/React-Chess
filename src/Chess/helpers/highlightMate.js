export default function highlightMate(
  player,
  squares,
  checkMated,
  staleMated
) {
  const copySquares = squares.slice();
  if (checkMated || staleMated) {
    for (let i = 0; i < 64; i++) {
      if (copySquares[i].ascii === (player === "w" ? "k" : "K")) {
        copySquares[i].checked = checkMated === true ? 1 : 2;
        break;
      }
    }
  }
  return copySquares;
}
