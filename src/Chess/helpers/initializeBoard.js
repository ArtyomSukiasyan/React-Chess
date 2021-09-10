import Piece from "../pieces/piece/Piece";
import King from "../pieces/King/King";
import Queen from "../pieces/Queen/Queen";
import Rook from "../pieces/Rook/Rook";
import Bishop from "../pieces/Bishop/Bishop";
import Knight from "../pieces/Knight/Knight";
import Pawn from "../pieces/Pawn/Pawn";

export default function initializeBoard() {
  const squares = Array(64).fill(null);
  for (let i = 8; i < 16; i++) {
    squares[i] = new Pawn("b");
  }
  for (let i = 8 * 6; i < 8 * 6 + 8; i++) {
    squares[i] = new Pawn("w");
  }
  squares[1] = new Knight("b");
  squares[6] = new Knight("b");

  squares[56 + 1] = new Knight("w");
  squares[56 + 6] = new Knight("w");

  squares[2] = new Bishop("b");
  squares[5] = new Bishop("b");

  squares[56 + 2] = new Bishop("w");
  squares[56 + 5] = new Bishop("w");

  squares[0] = new Rook("b");
  squares[7] = new Rook("b");

  squares[56 + 0] = new Rook("w");
  squares[56 + 7] = new Rook("w");

  squares[3] = new Queen("b");
  squares[4] = new King("b");

  squares[56 + 3] = new Queen("w");
  squares[56 + 4] = new King("w");

  for (let i = 0; i < 64; i++) {
    if (squares[i] === null) squares[i] = new Piece(null);
  }

  return squares;
}
