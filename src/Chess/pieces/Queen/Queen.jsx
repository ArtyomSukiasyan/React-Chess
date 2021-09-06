import whiteQueen from "../../images/whiteQueen.png";
import blackQueen from "../../images/blackQueen.png";
import styles from "../../Game.module.css";

export default class Queen {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteQueen} className={styles.piece} alt="WQ"></img>
      ) : (
        <img src={blackQueen} className={styles.piece} alt="BQ"></img>
      );
    this.ascii = player === "w" ? "q" : "Q";
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
    } else if (rowDiff === colDiff) {
      return true;
    } else if (rowDiff === -colDiff) {
      return true;
    }
    return false;
  }
}
