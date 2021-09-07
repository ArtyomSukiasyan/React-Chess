export default function castlingAllowed(
  start,
  end,
  squares,
  whiteKingHasMoved,
  blackKingHasMoved,
  rightWhiteRookHasMoved,
  leftWhiteRookHasMoved,
  rightBlackRookHasMoved,
  leftBlackRookHasMoved
) {
  let copySquares = squares.slice();
  
  const player = copySquares[start].player;
  const deltaPos = end - start;
  if (start !== (player === "w" ? 60 : 4)) return false;
  if (
    (deltaPos === 2
      ? copySquares[end + 1].ascii
      : copySquares[end - 2].ascii) !== (player === "w" ? "r" : "R")
  )
    return false;
  if ((player === "w" ? whiteKingHasMoved : blackKingHasMoved) !== 0)
    return false;
  if (player === "w") {
    if ((deltaPos === 2 ? rightWhiteRookHasMoved : leftWhiteRookHasMoved) !== 0)
      return false;
  } else if (player === "b") {
    if ((deltaPos === 2 ? rightBlackRookHasMoved : leftBlackRookHasMoved) !== 0)
      return false;
  }

  return true;
}
