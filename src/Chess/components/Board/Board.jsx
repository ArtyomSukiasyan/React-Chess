import React from "react";
import FillerPiece from "../../pieces/FillerPiece/FillerPiece";
import Queen from "../../pieces/Queen/Queen";
import Rook from "../../pieces/Rook/Rook"
import Bishop from "../../pieces/Bishop/Bishop"
import Knight from "../../pieces/Knight/Knight"
import Square from "../Squares/Squares";
import calcSquareColor from "../../helpers/calcSquareColor";
import clearHighlight from "../../helpers/clearHighlight";
import clearPossibleHighlight from "../../helpers/clearPossibleHighlight";
import highlightMate from "../../helpers/highlightMate";
import clearCheckHighlight from "../../helpers/clearCheckHighlight";
import MatchInfo from "../MatchInfo/MatchInfo";
import { state } from "../../constants/state";
import { colNums, rowNums } from "../../constants/colsAndRows";
import { white, black } from "../../constants/players";

import {
  whiteKing,
  blackKing,
  whiteQueen,
  blackQueen,
  whiteRook,
  blackRook,
  whiteBishop,
  blackBishop,
  whitePawn,
  blackPawn,
} from "../../constants/asciis";
import { next, back, nextAtw, backAtw } from "../../constants/histories";
import styles from "../../Game.module.css";

export default class Board extends React.Component {
  constructor() {
    super();
    this.state = state;
  }

  reset() {
    clearHighlight(this.state.squares);
    this.setState(state);
  }

  executeMove(player, squares, start, end) {
    let copySquares = squares.slice();

    copySquares = clearHighlight(copySquares);
    copySquares = clearPossibleHighlight(copySquares);
    for (let j = 0; j < 64; j++) {
      if (copySquares[j].ascii === whiteKing) {
        copySquares[j].inCheck = false;
        break;
      }
    }

    if (
      copySquares[start].ascii === (player === white ? whiteKing : blackKing)
    ) {
      if (player === white) {
        this.setState({
          whiteKingHasMoved: true,
        });
      } else {
        this.setState({
          blackKingHasMoved: true,
        });
      }
    }
    if (
      copySquares[start].ascii === (player === white ? whiteRook : blackRook)
    ) {
      if (start === (player === white ? 56 : 0)) {
        if (player === white) {
          this.setState({
            leftWhiteRookHasMoved: true,
          });
        } else {
          this.setState({
            leftBlackRookHasMoved: true,
          });
        }
      } else if (start === (player === white ? 63 : 7)) {
        if (player === white) {
          this.setState({
            rightWhiteRookHasMoved: true,
          });
        } else {
          this.setState({
            rightBlackRookHasMoved: true,
          });
        }
      }
    }

    copySquares = this.makeMove(copySquares, start, end);

    let passantTrue =
      player === white
        ? copySquares[end].ascii === whitePawn &&
          start >= 48 &&
          start <= 55 &&
          end - start === -16
        : copySquares[end].ascii === blackPawn &&
          start >= 8 &&
          start <= 15 &&
          end - start === 16;
    let passant = passantTrue ? end : 65;

    if (player === white) {
      copySquares = highlightMate(
        black,
        copySquares,
        this.checkmate(black, copySquares),
        this.stalemate(black, copySquares)
      );
    } else {
      copySquares = highlightMate(
        white,
        copySquares,
        this.checkmate(white, copySquares),
        this.stalemate(white, copySquares)
      );
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
      copySquares[end].ascii === whiteKing ||
      copySquares[end].ascii === blackKing;
    if (isKing && Math.abs(end - start) === 2) {
      if (end === (copySquares[end].ascii === whiteKing ? 62 : 6)) {
        copyHistoryH3.push(end - 1);
        copyHistoryH4.push(end + 1);
      } else if (end === (copySquares[end].ascii === whiteKing ? 58 : 2)) {
        copyHistoryH3.push(end + 1);
        copyHistoryH4.push(end - 2);
      }
    } else {
      copyHistoryH3.push(null);
      copyHistoryH4.push(null);
    }

    let checkMated =
      this.checkmate(white, copySquares) || this.checkmate(black, copySquares);
    let staleMated =
      (this.stalemate(white, copySquares) && player === black) ||
      (this.stalemate(black, copySquares) && player === white);

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
      turn: player === black ? white : black,
      trueTurn: player === black ? white : black,
    });
  }

  makeMove(squares, start, end, passantPos) {
    const copySquares = squares.slice();
    let isKing =
      copySquares[start].ascii === whiteKing ||
      copySquares[start].ascii === blackKing;
    if (isKing && Math.abs(end - start) === 2) {
      if (end === (copySquares[start].ascii === whiteKing ? 62 : 6)) {
        copySquares[end - 1] = copySquares[end + 1];
        copySquares[end - 1].highlight = true;
        copySquares[end + 1] = new FillerPiece(null);
        copySquares[end + 1].highlight = true;
      } else if (end === (copySquares[start].ascii === whiteKing ? 58 : 2)) {
        copySquares[end + 1] = copySquares[end - 2];
        copySquares[end + 1].highlight = true;
        copySquares[end - 2] = new FillerPiece(null);
        copySquares[end - 2].highlight = true;
      }
    }

    let passant = passantPos == null ? this.state.passantPos : passantPos;
    if (
      copySquares[start].ascii === whitePawn ||
      copySquares[start].ascii === blackPawn
    ) {
      if (end - start === -7 || end - start === 9) {
        if (start + 1 === passant)
          copySquares[start + 1] = new FillerPiece(null);
      } else if (end - start === -9 || end - start === 7) {
        if (start - 1 === passant)
          copySquares[start - 1] = new FillerPiece(null);
      }
    }

    copySquares[end] = copySquares[start];
    copySquares[end].highlight = true;
    copySquares[start] = new FillerPiece(null);
    copySquares[start].highlight = true;

    if (copySquares[end].ascii === whitePawn && end >= 0 && end <= 7) {
      const figure = prompt("please, select 'queen', 'rook', 'bishop' or 'knight'")
      if(figure === "queen"){
        copySquares[end] = new Queen(white);
      } else if(figure === "rook"){
        copySquares[end] = new Rook(white);
      } else if(figure === "bishop"){
        copySquares[end] = new Bishop(white);
      } else if(figure === "knight") {
        copySquares[end] = new Knight(white);

      }
      copySquares[end].highlight = true;
    }
    if (copySquares[end].ascii === blackPawn && end >= 56 && end <= 63) {
      const figure = prompt("please, select 'queen', 'rook', 'bishop' or 'knight'")
      if(figure === "queen"){
        copySquares[end] = new Queen(black);
      } else if(figure === "rook"){
        copySquares[end] = new Rook(black);
      } else if(figure === "bishop"){
        copySquares[end] = new Bishop(black);
      } else if(figure === "knight") {
        copySquares[end] = new Knight(black);

      }
      copySquares[end].highlight = true;
    }

    return copySquares;
  }

  castlingAllowed(start, end, squares) {
    const copySquares = squares.slice();
    let player = copySquares[start].player;
    let deltaPos = end - start;
    if (start !== (player === white ? 60 : 4)) return false;
    if (
      (deltaPos === 2
        ? copySquares[end + 1].ascii
        : copySquares[end - 2].ascii) !==
      (player === white ? whiteRook : blackRook)
    )
      return false;
    if (
      (player === white
        ? this.state.whiteKingHasMoved
        : this.state.blackKingHasMoved) !== false
    )
      return false;
    if (player === white) {
      if (
        (deltaPos === 2
          ? this.state.rightWhiteRookHasMoved
          : this.state.leftWhiteRookHasMoved) !== false
      )
        return false;
    } else if (player === black) {
      if (
        (deltaPos === 2
          ? this.state.rightBlackRookHasMoved
          : this.state.leftBlackRookHasMoved) !== false
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
      let position = 64 - startRow * 8 + -8 * rowCtr + (startCol - 1 + colCtr);
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
      if (copySquares[start].player === white && (start < 48 || start > 55))
        return false;
      if (copySquares[start].player === black && (start < 8 || start > 15))
        return false;
    }
    if (copySquares[end].ascii !== null) {
      if (colDiff === 0) return false;
    }
    if (rowDiff === 1 && colDiff === 1) {
      if (copySquares[end].ascii === null) {
        if (copySquares[start + 1].ascii !== blackPawn || passant !== start + 1)
          return false;
      }
    } else if (rowDiff === 1 && colDiff === -1) {
      if (copySquares[end].ascii === null) {
        if (copySquares[start - 1].ascii !== blackPawn || passant !== start - 1)
          return false;
      }
    } else if (rowDiff === -1 && colDiff === 1) {
      if (copySquares[end].ascii === null) {
        if (copySquares[start + 1].ascii !== whitePawn || passant !== start + 1)
          return false;
      }
    } else if (rowDiff === -1 && colDiff === -1) {
      if (copySquares[end].ascii === null) {
        if (copySquares[start - 1].ascii !== whitePawn || passant !== start - 1)
          return false;
      }
    }

    return true;
  }

  isInvalidMove(start, end, squares, passantPos) {
    const copySquares = squares.slice();
    let bqrpk =
      copySquares[start].ascii === whiteRook ||
      copySquares[start].ascii === blackRook ||
      copySquares[start].ascii === whiteQueen ||
      copySquares[start].ascii === blackQueen ||
      copySquares[start].ascii === whiteBishop ||
      copySquares[start].ascii === blackBishop ||
      copySquares[start].ascii === whitePawn ||
      copySquares[start].ascii === blackPawn ||
      copySquares[start].ascii === whiteKing ||
      copySquares[start].ascii === blackKing;
    let invalid =
      bqrpk === true && this.blockersExist(start, end, copySquares) === true;
    if (invalid) return invalid;
    let pawn =
      copySquares[start].ascii === whitePawn ||
      copySquares[start].ascii === blackPawn;
    invalid =
      pawn === true &&
      this.goodPawn(start, end, copySquares, passantPos) === false;
    if (invalid) return invalid;
    let king = copySquares[start].ascii.toLowerCase() === whiteKing;
    if (king && Math.abs(end - start) === 2)
      invalid = this.castlingAllowed(start, end, copySquares) === false;

    return invalid;
  }

  isMoveAvailable(start, end, squares, passantPos) {
    const copySquares = squares.slice();
    if (start === end) return false;

    let player = copySquares[start].player;
    if (
      player === copySquares[end].player ||
      copySquares[start].canMove(start, end) === false
    )
      return false;
    if (this.isInvalidMove(start, end, copySquares, passantPos) === true)
      return false;

    let cantCastle =
      copySquares[start].ascii === (player === white ? whiteKing : blackKing) &&
      Math.abs(end - start) === 2 &&
      this.isCheck(player, copySquares);
    if (cantCastle) return false;

    if (
      copySquares[start].ascii === (player === white ? whiteKing : blackKing) &&
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
    if (checkSquares[end].ascii === whitePawn && end >= 0 && end <= 7) {
      checkSquares[end] = new Queen(white);
    } else if (
      checkSquares[end].ascii === blackPawn &&
      end >= 56 &&
      end <= 63
    ) {
      checkSquares[end] = new Queen(black);
    }
    if (this.isCheck(player, checkSquares) === true) return false;

    return true;
  }

  isCheck(player, squares) {
    let king = player === white ? whiteKing : blackKing;
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
          this.isInvalidMove(i, positionOfKing, copySquares) === false
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
          if (this.isMoveAvailable(i, j, squares)) return false;
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
          if (this.isMoveAvailable(i, j, squares)) return false;
        }
      }
    }
    return true;
  }

  handleClick(i) {
    let copySquares = this.state.squares.slice();

    if (this.state.historyNum - 1 !== this.state.turnNum) {
      return null;
    }

    if (this.state.mated) return null;

    if (this.state.source === -1) {
      if (copySquares[i].player !== this.state.turn) return -1;

      if (copySquares[i].player !== null) {
        copySquares = clearCheckHighlight(copySquares, white);
        copySquares[i].highlight = true;

        for (let j = 0; j < 64; j++) {
          if (this.isMoveAvailable(i, j, copySquares))
            copySquares[j].possible = true;
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
        copySquares[i].highlight = true;
        copySquares[this.state.source].highlight = false;
        copySquares = clearPossibleHighlight(copySquares);
        for (let j = 0; j < 64; j++) {
          if (this.isMoveAvailable(i, j, copySquares))
            copySquares[j].possible = true;
        }
        this.setState({
          source: i,
          squares: copySquares,
        });
      } else {
        if (!this.isMoveAvailable(this.state.source, i, copySquares)) {
          copySquares[this.state.source].highlight = false;
          copySquares = clearPossibleHighlight(copySquares);
          if (
            i !== this.state.source &&
            this.isCheck(white, copySquares) === true
          ) {
            for (let j = 0; j < 64; j++) {
              if (copySquares[j].ascii === whiteKing) {
                copySquares[j].inCheck = true;
                break;
              }
            }
          }
          this.setState({
            source: -1,
            squares: copySquares,
          });
          return null;
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
        let squareCursor = styles.pointer;
        if (copySquares[i * 8 + j].player !== this.state.turn)
          squareCursor = styles.default;

        if (this.state.mated) squareCursor = styles.default;
        if (this.state.historyNum - 1 !== this.state.turnNum)
          squareCursor = styles.not_allowed;

        squareRows.push(
          <Square
            id={i * 8 + j}
            value={copySquares[i * 8 + j]}
            color={squareColor}
            cursor={squareCursor}
            onClick={() => this.handleClick(i * 8 + j)}
          />
        );
      }
      board.push(<div key={i + 64}>{squareRows}</div>);
    }
    console.log(board);
    return (
      <div className={styles.game}>
        <div>
          <div className={styles.board}>
            <div className={styles.row_label}> {rowNums} </div>
            <div>
              <div className={styles.table}> {board}</div>
              <div className={styles.col_label}> {colNums} </div>
            </div>
          </div>
          <MatchInfo
            backAtw={() => this.viewHistory(backAtw)}
            back={() => this.viewHistory(back)}
            reset={() => this.reset()}
            next={() => this.viewHistory(next)}
            nextAtw={() => this.viewHistory(nextAtw)}
          />
        </div>
        <div className={styles.wrapper}>
          <div
            className={this.state.turn === white ? styles.white_move : ""}
          ></div>

          <div
            className={this.state.turn === black ? styles.black_move : ""}
          ></div>
        </div>
      </div>
    );
  }

  viewHistory(direction) {
    let copySquares = null;

    if (direction === backAtw) {
      copySquares = this.state.history[0].slice();
    } else if (
      direction === nextAtw &&
      this.state.historyNum < this.state.turnNum + 1
    ) {
      copySquares = this.state.history[this.state.turnNum].slice();
    } else if (direction === back && this.state.historyNum - 2 >= 0) {
      copySquares = this.state.history[this.state.historyNum - 2].slice();
    } else if (
      direction === next &&
      this.state.historyNum <= this.state.turnNum
    ) {
      copySquares = this.state.history[this.state.historyNum].slice();
    }

    copySquares = clearPossibleHighlight(copySquares);
    copySquares = clearHighlight(copySquares);
    for (let j = 0; j < 64; j++) {
      if (
        copySquares[j].ascii ===
        (this.state.turn === white ? whiteKing : blackKing)
      ) {
        copySquares[j].inCheck = false;
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
    );

    let index = null;
    if (direction === back) index = this.state.historyNum - 2;
    else if (direction === next) index = this.state.historyNum;
    else if (direction === nextAtw) index = this.state.turnNum;

    if (index !== 0 && index != null) {
      if (this.state.historyH1[index] != null) {
        copySquares[this.state.historyH1[index]].highlight = true;
        copySquares[this.state.historyH2[index]].highlight = true;
      }
      if (this.state.historyH3[index] != null) {
        copySquares[this.state.historyH3[index]].highlight = true;
        copySquares[this.state.historyH4[index]].highlight = true;
      }
    }

    let newHistoryNum =
      direction === back
        ? this.state.historyNum - 1
        : this.state.historyNum + 1;
    if (direction === backAtw) newHistoryNum = 1;
    if (direction === nextAtw) newHistoryNum = this.state.turnNum + 1;

    this.setState({
      squares: copySquares,
      historyNum: newHistoryNum,
      turn: this.state.turn === white ? black : white,
    });

    if (direction === backAtw || direction === nextAtw) {
      this.setState({
        turn: direction === backAtw ? white : this.state.trueTurn,
      });
    }
  }
}
