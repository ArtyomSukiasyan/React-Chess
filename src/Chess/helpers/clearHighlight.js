export default function clearHighlight(squares) {
  const copySquares = squares.slice();
  for (let j = 0; j < 64; j++) {
    if (copySquares[j].highlight === 1) copySquares[j].highlight = 0;
  }
  return copySquares;
}
