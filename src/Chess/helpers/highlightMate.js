export default function highlightMate(
  player,
  squares,
  checkMated,
  staleMated
) {
  const copy_squares = squares.slice();
  if (checkMated || staleMated) {
    for (let j = 0; j < 64; j++) {
      if (copy_squares[j].ascii === (player === "w" ? "k" : "K")) {
        copy_squares[j].checked = checkMated === true ? 1 : 2;
        break;
      }
    }
  }
  return copy_squares;
}
