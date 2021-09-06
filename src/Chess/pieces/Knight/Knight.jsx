import whiteKnight from "../../images/whiteKnight.png";
import blackKnight from "../../images/blackKnight.png";
import styles from "../../Game.module.css";

export default class Knight {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteKnight} className={styles.piece} alt="WKN"></img>
      ) : (
        <img src={blackKnight} className={styles.piece} alt="BKN"></img>
      );
    this.ascii = player === "w" ? "n" : "N";
  }

  canMove(start, end) {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (rowDiff === 1 && colDiff === -2) {
      return true;
    } else if (rowDiff === 2 && colDiff === -1) {
      return true;
    } else if (rowDiff === 2 && colDiff === 1) {
      return true;
    } else if (rowDiff === 1 && colDiff === 2) {
      return true;
    } else if (rowDiff === -1 && colDiff === 2) {
      return true;
    } else if (rowDiff === -2 && colDiff === 1) {
      return true;
    } else if (rowDiff === -2 && colDiff === -1) {
      return true;
    } else if (rowDiff === -1 && colDiff === -2) {
      return true;
    }
    return false;
  }
}
