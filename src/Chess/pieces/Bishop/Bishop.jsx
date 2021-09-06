import whiteBishop from "../../images/whiteBishop.png";
import blackBishop from "../../images/blackBishop.png";
import styles from "../../Game.module.css";

export default class Bishop {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteBishop} className={styles.piece} alt="WB"></img>
      ) : (
        <img src={blackBishop} className={styles.piece} alt="BB"></img>
      );
    this.ascii = player === "w" ? "b" : "B";
  }

  canMove(start, end) {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (rowDiff === colDiff) {
      return true;
    } else if (rowDiff === -colDiff) {
      return true;
    }
    return false;
  }
}
