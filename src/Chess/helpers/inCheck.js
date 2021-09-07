import invalidMove from "./invalidMove";

export default function inCheck(
  player,
  squares,
  whiteKingHasMoved,
  blackKingHasMoved,
  rightWhiteRookHasMoved,
  leftWhiteRookHasMoved,
  rightBlackRookHasMoved,
  leftBlackRookHasMoved
) {
  let king = player === "w" ? "k" : "K";
  let positionOfKing = null;
  const copySquares = squares.slice();
  for (let i = 0; i < 64; i++) {
    if (copySquares[i].ascii === king) {
      positionOfKing = i;
      break;
    }
  }

  for (let i = 0; i < 64; i++) {
    if (copySquares[i].player !== player) {
      if (
        copySquares[i].canMove(i, positionOfKing) === true &&
        invalidMove(
          i,
          positionOfKing,
          copySquares,
          whiteKingHasMoved,
          blackKingHasMoved,
          rightWhiteRookHasMoved,
          leftWhiteRookHasMoved,
          rightBlackRookHasMoved,
          leftBlackRookHasMoved
        ) === false
      )
        return true;
    }
  }
  return false;
}
