import blockersExist from "./blockersExist";
import castlingAllowed from "./castlingAllowed";
import goodPawn from "./goodPawn";

export default function invalidMove(
  start,
  end,
  squares,
  passantPos,
  whiteKingHasMoved,
  blackKingHasMoved,
  rightWhiteRookHasMoved,
  leftWhiteRookHasMoved,
  rightBlackRookHasMoved,
  leftBlackRookHasMoved
) {
  const copySquares = squares.slice();
  console.log(copySquares);
  const bqrpk =
    copySquares[start].ascii.toLowerCase() === "r" ||
    copySquares[start].ascii.toLowerCase() === "q" ||
    copySquares[start].ascii.toLowerCase() === "b" ||
    copySquares[start].ascii.toLowerCase() === "p" ||
    copySquares[start].ascii.toLowerCase() === "k";
  let invalid =
    bqrpk === true && blockersExist(start, end, copySquares) === true;

  if (invalid) return invalid;
  const pawn = copySquares[start].ascii.toLowerCase() === "p";
  invalid =
    pawn === true && goodPawn(start, end, copySquares, passantPos) === false;
  if (invalid) return invalid;
  const king = copySquares[start].ascii.toLowerCase() === "k";
  if (king && Math.abs(end - start) === 2)
    invalid =
      castlingAllowed(
        start,
        end,
        copySquares,
        whiteKingHasMoved,
        blackKingHasMoved,
        rightWhiteRookHasMoved,
        leftWhiteRookHasMoved,
        rightBlackRookHasMoved,
        leftBlackRookHasMoved
      ) === false;

  return invalid;
}
