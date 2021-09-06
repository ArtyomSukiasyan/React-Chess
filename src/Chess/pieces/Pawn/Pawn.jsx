import whitePawn from "../../images/whitePawn.png";
import blackPawn from "../../images/blackPawn.png";
import styles from "../../Game.module.css";

export default class Pawn {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whitePawn} className={styles.piece} alt="WP"></img>
      ) : (
        <img src={blackPawn} className={styles.piece} alt="BP"></img>
      );
    this.ascii = player === "w" ? "p" : "P";
  }

  canMove(start, end) {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (this.player === "w") {
      if (colDiff === 0) {
        if (rowDiff === 1 || rowDiff === 2) return true;
      } else if (colDiff === -1 || colDiff === 1) {
        if (rowDiff === 1) return true;
      }
    } else {
      if (colDiff === 0) {
        if (rowDiff === -2 || rowDiff === -1) return true;
      } else if (colDiff === -1 || colDiff === 1) {
        if (rowDiff === -1) return true;
      }
    }
    return false;
  }
}
