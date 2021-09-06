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
        <img src={whiteRook} className={styles.piece} alt="WR"></img>
      ) : (
        <img src={blackRook} className={styles.piece} alt="BR"></img>
      );
    this.ascii = player === "w" ? "r" : "R";
  }

  canMove(start, end) {
    const start_row = 8 - Math.floor(start / 8);
    const start_col = (start % 8) + 1;
    const end_row = 8 - Math.floor(end / 8);
    const end_col = (end % 8) + 1;

    const rowDiff = end_row - start_row;
    const colDiff = end_col - start_col;

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
