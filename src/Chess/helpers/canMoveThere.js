import invalidMove from "./invalidMove";
import inCheck from "./inCheck";
import fillerPiece from "../pieces/piece/Piece";
import Queen from "../pieces/Queen/Queen";

export default function canMoveThere(
  start,
  end,
  squares,
  whiteKingHasMoved,
  blackKingHasMoved,
  rightWhiteRookHasMoved,
  leftWhiteRookHasMoved,
  rightBlackRookHasMoved,
  leftBlackRookHasMoved,
  passantPos
) {
  const copySquares = squares.slice();
  if (start === end) return false;

  const player = copySquares[start].player;
  if (
    player === copySquares[end].player ||
    copySquares[start].canMove(start, end) === false
  )
    return false;
  if (
    invalidMove(
      start,
      end,
      copySquares,
      whiteKingHasMoved,
      blackKingHasMoved,
      rightWhiteRookHasMoved,
      leftWhiteRookHasMoved,
      rightBlackRookHasMoved,
      leftBlackRookHasMoved,
      passantPos
    ) === true
  )
    return false;

  const cantCastle =
    copySquares[start].ascii === (player === "w" ? "k" : "K") &&
    Math.abs(end - start) === 2 &&
    inCheck(
      player,
      copySquares,
      whiteKingHasMoved,
      blackKingHasMoved,
      rightWhiteRookHasMoved,
      leftWhiteRookHasMoved,
      rightBlackRookHasMoved,
      leftBlackRookHasMoved
    );
  if (cantCastle) return false;

  if (
    copySquares[start].ascii === (player === "w" ? "k" : "K") &&
    Math.abs(end - start) === 2
  ) {
    const deltaPos = end - start;
    const testSquares = squares.slice();
    testSquares[start + (deltaPos === 2 ? 1 : -1)] = testSquares[start];
    testSquares[start] = new fillerPiece(null);
    if (
      inCheck(
        player,
        testSquares,
        whiteKingHasMoved,
        blackKingHasMoved,
        rightWhiteRookHasMoved,
        leftWhiteRookHasMoved,
        rightBlackRookHasMoved,
        leftBlackRookHasMoved
      )
    )
      return false;
  }

  const checkSquares = squares.slice();
  checkSquares[end] = checkSquares[start];
  checkSquares[start] = new fillerPiece(null);
  if (checkSquares[end].ascii === "p" && end >= 0 && end <= 7) {
    checkSquares[end] = new Queen("w");
  } else if (checkSquares[end].ascii === "P" && end >= 56 && end <= 63) {
    checkSquares[end] = new Queen("b");
  }
  if (
    inCheck(
      player,
      checkSquares,
      whiteKingHasMoved,
      blackKingHasMoved,
      rightWhiteRookHasMoved,
      leftWhiteRookHasMoved,
      rightBlackRookHasMoved,
      leftBlackRookHasMoved
    ) === true
  )
    return false;

  return true;
}
