export default function goodPawn(start, end, squares, passantPos) {
  const passant = passantPos === null ? this.state.passantPos : passantPos;
  const startRow = 8 - Math.floor(start / 8);
  const startCol = (start % 8) + 1;
  const endRow = 8 - Math.floor(end / 8);
  const endCol = (end % 8) + 1;
  const rowDiff = endRow - startRow;
  const colDiff = endCol - startCol;
  const copySquares = squares.slice();

  if (rowDiff === 2 || rowDiff === -2) {
    if (copySquares[start].player === "w" && (start < 48 || start > 55))
      return false;
    if (copySquares[start].player === "b" && (start < 8 || start > 15))
      return false;
  }
  if (copySquares[end].ascii !== null) {
    if (colDiff === 0) return false;
  }
  if (rowDiff === 1 && colDiff === 1) {
    if (copySquares[end].ascii === null) {
      if (copySquares[start + 1].ascii !== "P" || passant !== start + 1)
        return false;
    }
  } else if (rowDiff === 1 && colDiff === -1) {
    if (copySquares[end].ascii === null) {
      if (copySquares[start - 1].ascii !== "P" || passant !== start - 1)
        return false;
    }
  } else if (rowDiff === -1 && colDiff === 1) {
    if (copySquares[end].ascii === null) {
      if (copySquares[start + 1].ascii !== "p" || passant !== start + 1)
        return false;
    }
  } else if (rowDiff === -1 && colDiff === -1) {
    if (copySquares[end].ascii === null) {
      if (copySquares[start - 1].ascii !== "p" || passant !== start - 1)
        return false;
    }
  }

  return true;
}