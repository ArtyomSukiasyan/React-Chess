import { white } from "../../constants/players";
import { whiteKing, blackKing } from "../../constants/asciis";
import styles from "../../Game.module.css";

export default class King {
  constructor(player) {
    this.player = player;
    this.highlight = false;
    this.possible = false;
    this.checked = false;
    this.inCheck = false;
    this.icon = (
      <span className={styles.piece}>
        {player === white
          ? String.fromCharCode(9812)
          : String.fromCharCode(9818)}
      </span>
    );
    this.ascii = player === white ? whiteKing : blackKing;
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
