import React from "react"
import FillerPiece from "../../pieces/FillerPiece/FillerPiece"
import Queen from "../../pieces/Queen/Queen";
import Square from "../Squares/Squares"
import calcSquareColor from "../../helpers/calcSquareColor";
import initializeBoard from "../../helpers/initializeBoard"
import clearHighlight from "../../helpers/clearHighlight";
import clearPossibleHighlight from "../../helpers/clearPossibleHighlight";
import highlightMate from "../../helpers/highlightMate";
import clearCheckHighlight from "../../helpers/clearCheckHighlight";
import { colNums, rowNums } from "../../constants/colsAndRows";
import MatchInfo from "../MatchInfo/MatchInfo"
import styles from "../../Game.module.css"

export default class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: initializeBoard(),
      source: -1,
      turn: "w",
      trueTurn: "w",
      turnNum: 0,
      whiteKingHasMoved: 0,
      blackKingHasMoved: 0,
      leftBlackRookHasMoved: 0,
      rightBlackRookHasMoved: 0,
      leftWhiteRookHasMoved: 0,
      rightWhiteRookHasMoved: 0,
      passantPos: 65,
      history: [initializeBoard()],
      historyNum: 1,
      historyH1: [null],
      historyH2: [null],
      historyH3: [null],
      historyH4: [null],
      mated: false,
    };
  }

  reset() {
    this.setState({
      squares: initializeBoard(),
      source: -1,
      turn: "w",
      trueTurn: "w",
      turnNum: 0,
      whiteKingHasMoved: 0,
      blackKingHasMoved: 0,
      leftBlackRookHasMoved: 0,
      rightBlackRookHasMoved: 0,
      leftWhiteRookHasMoved: 0,
      rightWhiteRookHasMoved: 0,
      passantPos: 65,
      history: [initializeBoard()],
      historyNum: 1,
      historyH1: [0],
      historyH2: [0],
      historyH3: [null],
      historyH4: [null],
      mated: false,
    });
  }

  executeMove(player, squares, start, end) {
    let copySquares = squares.slice();

    copySquares = clearHighlight(copySquares).slice();
    if (player === "w") {
      copySquares = clearPossibleHighlight(copySquares).slice();
      for (let j = 0; j < 64; j++) {
        if (copySquares[j].ascii === "k") {
          copySquares[j].in_check = 0;
          break;
        }
      }
    }

    if (copySquares[start].ascii === (player === "w" ? "k" : "K")) {
      if (player === "w") {
        this.setState({
          whiteKingHasMoved: 1,
        });
      } else {
        this.setState({
          blackKingHasMoved: 1,
        });
      }
    }
    if (copySquares[start].ascii === (player === "w" ? "r" : "R")) {
      if (start === (player === "w" ? 56 : 0)) {
        if (player === "w") {
          this.setState({
            leftWhiteRookHasMoved: 1,
          });
        } else {
          this.setState({
            leftBlackRookHasMoved: 1,
          });
        }
      } else if (start === (player === "w" ? 63 : 7)) {
        if (player === "w") {
          this.setState({
            rightWhiteRookHasMoved: 1,
          });
        } else {
          this.setState({
            rightBlackRookHasMoved: 1,
          });
        }
      }
    }

    copySquares = this.makeMove(copySquares, start, end).slice();

    let passantTrue =
      player === "w"
        ? copySquares[end].ascii === "p" &&
          start >= 48 &&
          start <= 55 &&
          end - start === -16
        : copySquares[end].ascii === "P" &&
          start >= 8 &&
          start <= 15 &&
          end - start === 16;
    let passant = passantTrue ? end : 65;

    if (player === "w") {
      copySquares = highlightMate(
        "b",
        copySquares,
        this.checkmate("b", copySquares),
        this.stalemate("b", copySquares)
      ).slice();
    } else {
      copySquares = highlightMate(
        "w",
        copySquares,
        this.checkmate("w", copySquares),
        this.stalemate("w", copySquares)
      ).slice();
    }

    const copyHistory = this.state.history.slice();
    const copyHistoryH1 = this.state.historyH1.slice();
    const copyHistoryH2 = this.state.historyH2.slice();
    const copyHistoryH3 = this.state.historyH3.slice();
    const copyHistoryH4 = this.state.historyH4.slice();
    copyHistory.push(copySquares);
    copyHistoryH1.push(start);
    copyHistoryH2.push(end);
    

    let isKing =
    copySquares[end].ascii === "k" || copySquares[end].ascii === "K";
    if (isKing && Math.abs(end - start) === 2) {
      if (end === (copySquares[end].ascii === "k" ? 62 : 6)) {
        copyHistoryH3.push(end - 1);
        copyHistoryH4.push(end + 1);
      } else if (end === (copySquares[end].ascii === "k" ? 58 : 2)) {
        copyHistoryH3.push(end + 1);
        copyHistoryH4.push(end - 2);
      }
    } else {
      copyHistoryH3.push(null);
      copyHistoryH4.push(null);
    }

    let checkMated =
      this.checkmate("w", copySquares) || this.checkmate("b", copySquares);
    let staleMated =
      (this.stalemate("w", copySquares) && player === "b") ||
      (this.stalemate("b", copySquares) && player === "w");

    this.setState({
      passantPos: passant,
      history: copyHistory,
      historyNum: this.state.historyNum + 1,
      historyH1: copyHistoryH1,
      historyH2: copyHistoryH2,
      historyH3: copyHistoryH3,
      historyH4: copyHistoryH4,
      squares: copySquares,
      source: -1,
      turnNum: this.state.turnNum + 1,
      mated: checkMated || staleMated ? true : false,
      turn: player === "b" ? "w" : "b",
      trueTurn: player === "b" ? "w" : "b",
    });
  }

  makeMove(squares, start, end, passantPos) {
    const copySquares = squares.slice();
    let isKing =
    copySquares[start].ascii === "k" || copySquares[start].ascii === "K";
    if (isKing && Math.abs(end - start) === 2) {
      if (end === (copySquares[start].ascii === "k" ? 62 : 6)) {
        copySquares[end - 1] = copySquares[end + 1];
        copySquares[end - 1].highlight = 1;
        copySquares[end + 1] = new FillerPiece(null);
        copySquares[end + 1].highlight = 1;
      } else if (end === (copySquares[start].ascii === "k" ? 58 : 2)) {
        copySquares[end + 1] = copySquares[end - 2];
        copySquares[end + 1].highlight = 1;
        copySquares[end - 2] = new FillerPiece(null);
        copySquares[end - 2].highlight = 1;
      }
    }

    let passant = passantPos == null ? this.state.passantPos : passantPos;
    if (copySquares[start].ascii.toLowerCase() === "p") {
      if (end - start === -7 || end - start === 9) {
        if (start + 1 === passant)
        copySquares[start + 1] = new FillerPiece(null);
      } else if (end - start === -9 || end - start === 7) {
        if (start - 1 === passant)
        copySquares[start - 1] = new FillerPiece(null);
      }
    }

    copySquares[end] = copySquares[start];
    copySquares[end].highlight = 1;
    copySquares[start] = new FillerPiece(null);
    copySquares[start].highlight = 1;

    if (copySquares[end].ascii === "p" && end >= 0 && end <= 7) {
      copySquares[end] = new Queen("w");
      copySquares[end].highlight = 1;
    }
    if (copySquares[end].ascii === "P" && end >= 56 && end <= 63) {
      copySquares[end] = new Queen("b");
      copySquares[end].highlight = 1;
    }

    return copySquares;
  }

  castlingAllowed(start, end, squares) {
    const copySquares = squares.slice();
    let player = copySquares[start].player;
    let deltaPos = end - start;
    if (start !== (player === "w" ? 60 : 4)) return false;
    if (
      (deltaPos === 2
        ? copySquares[end + 1].ascii
        : copySquares[end - 2].ascii) !== (player === "w" ? "r" : "R")
    )
      return false;
    if (
      (player === "w"
        ? this.state.whiteKingHasMoved
        : this.state.blackKingHasMoved) !== 0
    )
      return false;
    if (player === "w") {
      if (
        (deltaPos === 2
          ? this.state.rightWhiteRookHasMoved
          : this.state.leftWhiteRookHasMoved) !== 0
      )
        return false;
    } else if (player === "b") {
      if (
        (deltaPos === 2
          ? this.state.rightBlackRookHasMoved
          : this.state.leftBlackRookHasMoved) !== 0
      )
        return false;
    }

    return true;
  }

  blockersExist(start, end, squares) {
    let startRow = 8 - Math.floor(start / 8);
    let startCol = (start % 8) + 1;
    let endRow = 8 - Math.floor(end / 8);
    let endCol = (end % 8) + 1;
    let rowDiff = endRow - startRow;
    let colDiff = endCol - startCol;
    let rowCtr = 0;
    let colCtr = 0;
    const copySquares = squares.slice();

    while (colCtr !== colDiff || rowCtr !== rowDiff) {
      let position =
        64 - startRow * 8 + -8 * rowCtr + (startCol - 1 + colCtr);
      if (
        copySquares[position].ascii != null &&
        copySquares[position] !== copySquares[start]
      )
        return true;
      if (colCtr !== colDiff) {
        if (colDiff > 0) {
          ++colCtr;
        } else {
          --colCtr;
        }
      }
      if (rowCtr !== rowDiff) {
        if (rowDiff > 0) {
          ++rowCtr;
        } else {
          --rowCtr;
        }
      }
    }
    return false;
  }
  
  goodPawn(start, end, squares, passantPos) {
    let passant = passantPos === undefined ? this.state.passantPos : passantPos;
    let startRow = 8 - Math.floor(start / 8);
    let startCol = (start % 8) + 1;
    let endRow = 8 - Math.floor(end / 8);
    let endCol = (end % 8) + 1;
    let rowDiff = endRow - startRow;
    let colDiff = endCol - startCol;
    const copySquares = squares.slice();

    if (rowDiff === 2 || rowDiff === -2) {
      if (copySquares[start].player === "w" && (start < 48 || start > 55))
        return false;
      if (copySquares[start].player === "b" && (start < 8 || start > 15))
        return false;
    }
    if (copySquares[end].ascii !== null) {
      if (colDiff === 0) return false;
    }
    if (rowDiff === 1 && colDiff === 1) {
      if (copySquares[end].ascii === null) {
        if (copySquares[start + 1].ascii !== "P" || passant !== start + 1)
          return false;
      }
    } else if (rowDiff === 1 && colDiff === -1) {
      if (copySquares[end].ascii === null) {
        if (copySquares[start - 1].ascii !== "P" || passant !== start - 1)
          return false;
      }
    } else if (rowDiff === -1 && colDiff === 1) {
      if (copySquares[end].ascii === null) {
        if (copySquares[start + 1].ascii !== "p" || passant !== start + 1)
          return false;
      }
    } else if (rowDiff === -1 && colDiff === -1) {
      if (copySquares[end].ascii === null) {
        if (copySquares[start - 1].ascii !== "p" || passant !== start - 1)
          return false;
      }
    }

    return true;
  }

  invalidMove(start, end, squares, passantPos) {
    const copySquares = squares.slice();
    let bqrpk =
    copySquares[start].ascii.toLowerCase() === "r" ||
    copySquares[start].ascii.toLowerCase() === "q" ||
    copySquares[start].ascii.toLowerCase() === "b" ||
    copySquares[start].ascii.toLowerCase() === "p" ||
    copySquares[start].ascii.toLowerCase() === "k";
    let invalid =
      bqrpk === true && this.blockersExist(start, end, copySquares) === true;
    if (invalid) return invalid;
    let pawn = copySquares[start].ascii.toLowerCase() === "p";
    invalid =
      pawn === true &&
      this.goodPawn(start, end, copySquares, passantPos) === false;
    if (invalid) return invalid;
    let king = copySquares[start].ascii.toLowerCase() === "k";
    if (king && Math.abs(end - start) === 2)
      invalid = this.castlingAllowed(start, end, copySquares) === false;

    return invalid;
  }

  canMoveThere(start, end, squares, passantPos) {
    const copySquares = squares.slice();
    if (start === end)
      return false;

    let player = copySquares[start].player;
    if (
      player === copySquares[end].player ||
      copySquares[start].canMove(start, end) === false
    )
      return false;
    if (this.invalidMove(start, end, copySquares, passantPos) === true)
      return false;

    let cantCastle =
    copySquares[start].ascii === (player === "w" ? "k" : "K") &&
      Math.abs(end - start) === 2 &&
      this.isCheck(player, copySquares);
    if (cantCastle) return false;

    if (
      copySquares[start].ascii === (player === "w" ? "k" : "K") &&
      Math.abs(end - start) === 2
    ) {
      let deltaPos = end - start;
      const testSquares = squares.slice();
      testSquares[start + (deltaPos === 2 ? 1 : -1)] = testSquares[start];
      testSquares[start] = new FillerPiece(null);
      if (this.isCheck(player, testSquares)) return false;
    }

    const checkSquares = squares.slice();
    checkSquares[end] = checkSquares[start];
    checkSquares[start] = new FillerPiece(null);
    if (checkSquares[end].ascii === "p" && end >= 0 && end <= 7) {
      checkSquares[end] = new Queen("w");
    } else if (checkSquares[end].ascii === "P" && end >= 56 && end <= 63) {
      checkSquares[end] = new Queen("b");
    }
    if (this.isCheck(player, checkSquares) === true) return false;

    return true;
  }

  isCheck(player, squares) {
    let king = player === "w" ? "k" : "K";
    let positionOfKing = null;
    const copySquares = squares.slice();
    for (let i = 0; i < 64; i++) {
      if (copySquares[i].ascii === king) {
        positionOfKing = i;
        break;
      }
    }

    for (let i = 0; i < 64; i++) {
      if (copySquares[i].player !== player) {
        if (
          copySquares[i].canMove(i, positionOfKing) === true &&
          this.invalidMove(i, positionOfKing, copySquares) === false
        )
          return true;
      }
    }
    return false;
  }

  stalemate(player, squares) {
    if (this.isCheck(player, squares)) return false;

    for (let i = 0; i < 64; i++) {
      if (squares[i].player === player) {
        for (let j = 0; j < 64; j++) {
          if (this.canMoveThere(i, j, squares)) return false;
        }
      }
    }
    return true;
  }

  checkmate(player, squares) {
    if (!this.isCheck(player, squares)) return false;
    for (let i = 0; i < 64; i++) {
      if (squares[i].player === player) {
        for (let j = 0; j < 64; j++) {
          if (this.canMoveThere(i, j, squares)) return false;
        }
      }
    }
    return true;
  }

  handleClick(i) {
    let copySquares = this.state.squares.slice();

    if (this.state.historyNum - 1 !== this.state.turnNum) {
      return "currently viewing history";
    }

    if (this.state.mated) return "game-over";

    if (this.state.source === -1) {
      if (copySquares[i].player !== this.state.turn) return -1;

      if (copySquares[i].player !== null) {

        copySquares = clearCheckHighlight(copySquares, "w").slice();
        copySquares[i].highlight = 1; 

        for (let j = 0; j < 64; j++) {
          if (this.canMoveThere(i, j, copySquares))
          copySquares[j].possible = 1;
        }

        this.setState({
          source: i, 
          squares: copySquares,
        });
      }
    }

    if (this.state.source > -1) {
      let cannibalism = copySquares[i].player === this.state.turn;
      if (cannibalism === true && this.state.source !== i) {
        copySquares[i].highlight = 1;
        copySquares[this.state.source].highlight = 0;
        copySquares = clearPossibleHighlight(copySquares).slice();
        for (let j = 0; j < 64; j++) {
          if (this.canMoveThere(i, j, copySquares))
          copySquares[j].possible = 1;
        }
        this.setState({
          source: i, 
          squares: copySquares,
        });
      } else {
        if (!this.canMoveThere(this.state.source, i, copySquares)) {
          copySquares[this.state.source].highlight = 0;
          copySquares = clearPossibleHighlight(copySquares).slice();
          if (
            i !== this.state.source &&
            this.isCheck("w", copySquares) === true
          ) {
            for (let j = 0; j < 64; j++) {
              if (copySquares[j].ascii === "k") {
                copySquares[j].in_check = 1;
                break;
              }
            }
           
          }
          this.setState({
            source: -1,
            squares: copySquares,
          });
          return "invalid move";
        }
        this.executeMove(this.state.turn, copySquares, this.state.source, i);
      }
    }
  }

  

  render() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      const squareRows = [];
      for (let j = 0; j < 8; j++) {
        const copySquares = this.state.squares.slice();
        let squareColor = calcSquareColor(i, j, copySquares);
        let squareCursor;
        if (copySquares[i * 8 + j].player === this.state.turn)
          // squareCursor = "pointer";

        if (this.state.mated) {
          // SquareCursor = "default";
        }
        if (this.state.historyNum - 1 !== this.state.trueNum)
          // squareCursor = "not_allowed";

        squareRows.push(
          <Square
            key={i * 8 + j}
            value={copySquares[i * 8 + j]}
            color={squareColor}
            cursor={squareCursor}
            onClick={() => this.handleClick(i * 8 + j)}
          />
        );
      }
      board.push(<div key={i}>{squareRows}</div>);
    }

    return (
      <div className={styles.game}>
        <div>
          <div className={styles.board}>
            <div className={styles.row_label}> {rowNums} </div>
            <div>
              <div className={styles.table}> {board} </div>
              <div className={styles.col_label}> {colNums} </div>
            </div>
          </div>
          <MatchInfo
            turn={this.state.turn}
            backAtw={() => this.viewHistory("back_atw")}
            back={() => this.viewHistory("back")}
            reset={() => this.reset()}
            next={() => this.viewHistory("next")}
            nextAtw={() => this.viewHistory("next_atw")}
          />
        </div>
        <div className={styles.wrapper}>
          <div
            className={this.state.turn === "w" ? styles.white_move : ""}
          ></div>

          <div
            className={this.state.turn === "b" ? styles.black_move : ""}
          ></div>
        </div>
      </div>
    );
  }

  viewHistory(direction) {    
    let copySquares = null;

    if (direction === "back_atw") {
      copySquares = this.state.history[0].slice();
    } else if (
      direction === "next_atw" &&
      this.state.historyNum < this.state.turnNum + 1
    ) {
      copySquares = this.state.history[this.state.turnNum].slice();
    } else if (direction === "back" && this.state.historyNum - 2 >= 0) {
      copySquares = this.state.history[this.state.historyNum - 2].slice();
    } else if (
      direction === "next" &&
      this.state.historyNum <= this.state.turnNum
    ) {
      copySquares = this.state.history[this.state.historyNum].slice();
    }

    copySquares = clearPossibleHighlight(copySquares).slice();
    copySquares = clearHighlight(copySquares).slice();
    for (let j = 0; j < 64; j++) {
      if (copySquares[j].ascii === (this.state.turn === "w" ? "k" : "K")) {
        copySquares[j].in_check = 0;
        copySquares[j].checked = 0;
        break;
      }
    }

    let stale =
      this.stalemate(this.state.trueTurn, copySquares) &&
      this.state.turn !== this.state.trueTurn;
    copySquares = highlightMate(
      this.state.trueTurn,
      copySquares,
      this.checkmate(this.state.trueTurn, copySquares),
      stale
    ).slice();

    let index = null;
    if (direction === "back") index = this.state.historyNum - 2;
    else if (direction === "next") index = this.state.historyNum;
    else if (direction === "next_atw") index = this.state.turnNum;

    if (index !== 0 && index != null) {
      if (this.state.historyH1[index] != null) {
        copySquares[this.state.historyH1[index]].highlight = 1;
        copySquares[this.state.historyH2[index]].highlight = 1;
      }
      if (this.state.historyH3[index] != null) {
        copySquares[this.state.historyH3[index]].highlight = 1;
        copySquares[this.state.historyH4[index]].highlight = 1;
      }
    }

    let newHistoryNum =
      direction === "back"
        ? this.state.historyNum - 1
        : this.state.historyNum + 1;
    if (direction === "back_atw") newHistoryNum = 1;
    if (direction === "next_atw") newHistoryNum = this.state.turnNum + 1;

    this.setState({
      squares: copySquares,
      historyNum: newHistoryNum,
      turn: this.state.turn === "w" ? "b" : "w",
     
      
    });

    if (direction === "back_atw" || direction === "next_atw") {
      this.setState({
        turn: direction === "back_atw" ? "w" : this.state.trueTurn,
      });
    }
  }
}
