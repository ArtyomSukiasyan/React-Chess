import { white } from "../../constants/players";
import { whiteRook, blackRook } from "../../constants/asciis";
import whiteRookImage from "../../images/whiteRook.png";
import blackRookImage from "../../images/blackRook.png";
import styles from "../../Game.module.css";

export default class Rook {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === white ? (
        <img
          src={whiteRookImage}
          className={styles.piece}
          alt="whiteRook"
        ></img>
      ) : (
        <img
          src={blackRookImage}
          className={styles.piece}
          alt="blackRook"
        ></img>
      );
    this.ascii = player === white ? whiteRook : blackRook;
  }

  canMove(start, end) {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    return rowDiff * colDiff === 0 && rowDiff + colDiff !== 0;
  }
}
