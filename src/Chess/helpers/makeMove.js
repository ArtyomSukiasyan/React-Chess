import fillerPiece from "../pieces/piece/Piece";
import Queen from "../pieces/Queen/Queen";

export default function makeMove(squares, start, end, passantPos) {
  const copySquares = squares.slice();
  const isKing =
    copySquares[start].ascii === "k" || copySquares[start].ascii === "K";
  if (isKing && Math.abs(end - start) === 2) {
    if (end === (copySquares[start].ascii === "k" ? 62 : 6)) {
      copySquares[end - 1] = copySquares[end + 1];
      copySquares[end - 1].highlight = 1;
      copySquares[end + 1] = new fillerPiece(null);
      copySquares[end + 1].highlight = 1;
    } else if (end === (copySquares[start].ascii === "k" ? 58 : 2)) {
      copySquares[end + 1] = copySquares[end - 2];
      copySquares[end + 1].highlight = 1;
      copySquares[end - 2] = new fillerPiece(null);
      copySquares[end - 2].highlight = 1;
    }
  }

  const passant = passantPos === null ? this.state.passantPos : passantPos;
  if (copySquares[start].ascii.toLowerCase() === "p") {
    if (end - start === -7 || end - start === 9) {
      if (start + 1 === passant)
        copySquares[start + 1] = new fillerPiece(null);
    } else if (end - start === -9 || end - start === 7) {
      if (start - 1 === passant)
        copySquares[start - 1] = new fillerPiece(null);
    }
  }

  copySquares[end] = copySquares[start];
  copySquares[end].highlight = 1;
  copySquares[start] = new fillerPiece(null);
  copySquares[start].highlight = 1;

  if (copySquares[end].ascii === "p" && end >= 0 && end <= 7) {
    copySquares[end] = new Queen("w");
    copySquares[end].highlight = 1;
  }
  if (copySquares[end].ascii === "P" && end >= 56 && end <= 63) {
    copySquares[end] = new Queen("b");
    copySquares[end].highlight = 1;
  }

  return copySquares;
}