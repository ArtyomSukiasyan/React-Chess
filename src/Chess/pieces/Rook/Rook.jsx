import whiteRook from "../../images/whiteRook.png";
import blackRook from "../../images/blackRook.png";
import styles from "../../Game.module.css";

export default class Rook {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteRook} className={styles.piece} alt="whiteRook"></img>
      ) : (
        <img src={blackRook} className={styles.piece} alt="blackRook"></img>
      );
    this.ascii = player === "w" ? "r" : "R";
  }

  canMove(start, end) {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (rowDiff > 0 && colDiff === 0) {
      return true;
    } else if (rowDiff === 0 && colDiff > 0) {
      return true;
    } else if (rowDiff < 0 && colDiff === 0) {
      return true;
    } else if (rowDiff === 0 && colDiff < 0) {
      return true;
    }
    return false;
  }
}
