import whiteKing from "../../images/whiteKing.png";
import blackKing from "../../images/blackKing.png";
import styles from "../../Game.module.css";

export default class King {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.checked = 0;
    this.inCheck = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteKing} className={styles.piece} alt="WK"></img>
      ) : (
        <img src={blackKing} className={styles.piece} alt="BK"></img>
      );
    this.ascii = player === "w" ? "k" : "K";
  }

  canMove(start, end) {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (rowDiff === 1 && colDiff === -1) {
      return true;
    } else if (rowDiff === 1 && colDiff === 0) {
      return true;
    } else if (rowDiff === 1 && colDiff === 1) {
      return true;
    } else if (rowDiff === 0 && colDiff === 1) {
      return true;
    } else if (rowDiff === -1 && colDiff === 1) {
      return true;
    } else if (rowDiff === -1 && colDiff === 0) {
      return true;
    } else if (rowDiff === -1 && colDiff === -1) {
      return true;
    } else if (rowDiff === 0 && colDiff === -1) {
      return true;
    } else if (rowDiff === 0 && colDiff === 2) {
      return true;
    } else if (rowDiff === 0 && colDiff === -2) {
      return true;
    }
    return false;
  }
}
