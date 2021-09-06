export default function highlightMate(
  player,
  squares,
  check_mated,
  stale_mated
) {
  const copy_squares = squares.slice();
  if (check_mated || stale_mated) {
    for (let j = 0; j < 64; j++) {
      if (copy_squares[j].ascii === (player === "w" ? "k" : "K")) {
        copy_squares[j].checked = check_mated === true ? 1 : 2;
        break;
      }
    }
  }
  return copy_squares;
}
