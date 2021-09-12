export default function clearPossibleHighlight(squares) {
  const copySquares = squares.slice();
  for (let i = 0; i < 64; i++) {
    if (copySquares[i].possible === 1) copySquares[i].possible = 0;
  }
  return copySquares;
}
