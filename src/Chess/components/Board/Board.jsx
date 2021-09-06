import React from "react";
import Square from "../Squares/Squares";
import Queen from "../../pieces/Queen/Queen";
import fillerPiece from "../../pieces/piece/Piece";
import initializeBoard from "../../helpers/initializeBoard";
import clearHighlight from "../../helpers/clearHighlight";
import clearCheckHighlight from "../../helpers/clearCheckHighlight";
import clearPossibleHighlight from "../../helpers/clearPossibleHighlight";
import highlightMate from "../../helpers/highlightMate";
import Notation from "../../helpers/notation";
import calcSquareColor from "../../helpers/calcSquareColor";
import styles from "../../Game.module.css";

export default class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: initializeBoard(),
      source: -1,
      turn: "w",
      trueTurn: "w",
      trueNum: 0,
      firstPos: null,
      secondPos: null,
      repetition: 0,
      whiteKingHasMoved: 0,
      blackKingHasMoved: 0,
      leftBlackRookHasMoved: 0,
      rightBlackRookHasMoved: 0,
      leftWhiteRookHasMoved: 0,
      rightWhiteRookHasMoved: 0,
      passantPos: 65,
      piecesCollectedByWhite: [],
      piecesCollectedByBlack: [],
      history: [initializeBoard()],
      historyNum: 1,
      historyH1: [null],
      historyH2: [null],
      historyH3: [null],
      historyH4: [null],
      historyWhiteCollection: [null],
      historyBlackCollection: [null],
      mated: false,
      moveMade: false,
      captureMade: false,
      checkFlash: false,
      viewingHistory: false,
      justClicked: false,
    };
  }

  reset() {
    if (
      this.state.historyNum - 1 === this.state.trueNum &&
      this.state.turn === "1" &&
      !this.state.mated
    ) {
      return "cannot reset";
    }

    this.setState({
      squares: initializeBoard(),
      source: -1,
      turn: "w",
      trueTurn: "w",
      trueNum: 0,
      firstPos: null,
      secondPos: null,
      repetition: 0,
      whiteKingHasMoved: 0,
      blackKingHasMoved: 0,
      leftBlackRookHasMoved: 0,
      rightBlackRookHasMoved: 0,
      leftWhiteRookHasMoved: 0,
      rightWhiteRookHasMoved: 0,
      passantPos: 65,
      piecesCollectedByWhite: [],
      piecesCollectedByBlack: [],
      history: [initializeBoard()],
      historyNum: 1,
      historyH1: [0],
      historyH2: [0],
      historyH3: [null],
      historyH4: [null],
      historyWhiteCollection: [null],
      historyBlackCollection: [null],
      mated: false,
      moveMade: false,
      captureMade: false,
      checkFlash: false,
      viewingHistory: false,
      justClicked: false,
    });
  }

  executeMove(player, squares, start, end) {
    let copySquares = squares.slice();

    copySquares = clearHighlight(copySquares).slice();
    if (player === "w") {
      copySquares = clearPossibleHighlight(copySquares).slice();
      for (let j = 0; j < 64; j++) {
        if (copySquares[j].ascii === "k") {
          copySquares[j].inCheck = 0;
          break;
        }
      }
    }

    // note if king or rook has moved (castling not allowed if these have moved)
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

    // add captured pieces to collection
    const collection =
      player === "w"
        ? this.state.piecesCollectedByWhite.slice()
        : this.state.piecesCollectedByBlack.slice();
    if (copySquares[end].ascii !== null) {
      this.setState({
        captureMade: true,
      });
    }

    // make the move
    copySquares = this.makeMove(copySquares, start, end).slice();

    // en passant helper
    const passantTrue =
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

    // highlight mate
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
    const copyWhiteCollection = this.state.historyWhiteCollection.slice();
    const copyBlackCollection = this.state.historyBlackCollection.slice();
    copyHistory.push(copySquares);
    copyHistoryH1.push(start);
    copyHistoryH2.push(end);
    copyWhiteCollection.push(
      player === "w" ? collection : this.state.piecesCollectedByWhite
    );
    copyBlackCollection.push(
      player === "b" ? collection : this.state.piecesCollectedByBlack
    );

    const isKing =
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
      historyWhiteCollection: copyWhiteCollection,
      historyBlackCollection: copyBlackCollection,
      squares: copySquares,
      source: -1,
      trueNum: this.state.trueNum + 1,
      mated: checkMated || staleMated ? true : false,
      turn: player === "b" ? "w" : "b",
      trueTurn: player === "b" ? "w" : "b",
      moveMade: true,
    });

    if (player === "b") {
      this.setState({
        firstPos: start,
        secondPos: end,
        piecesCollectedByBlack: collection,
      });
    } else {
      this.setState({
        piecesCollectedByWhite: collection,
      });
    }
  }

  // make a move
  makeMove(squares, start, end, passantPos) {
    const copySquares = squares.slice();
    // castling
    const isKing =
      copySquares[start].ascii === "k" || copySquares[start].ascii === "K";
    if (isKing && Math.abs(end - start) === 2) {
      if (end === (copySquares[start].ascii === "k" ? 62 : 6)) {
        copySquares[end - 1] = copySquares[end + 1];
        copySquares[end - 1].highlight = 1;
        copySquares[end + 1] = new fillerPiece(null);
        copySquares[end + 1].highlight = 1;
      } else if (end === (copySquares[start].ascii === "k" ? 58 : 2)) {
        copySquares[end + 1] = copySquares[end - 2];
        copySquares[end + 1].highlight = 1;
        copySquares[end - 2] = new fillerPiece(null);
        copySquares[end - 2].highlight = 1;
      }
    }

    // en passant
    const passant = passantPos === null ? this.state.passantPos : passantPos;
    if (copySquares[start].ascii.toLowerCase() === "p") {
      if (end - start === -7 || end - start === 9) {
        if (start + 1 === passant)
          copySquares[start + 1] = new fillerPiece(null);
      } else if (end - start === -9 || end - start === 7) {
        if (start - 1 === passant)
          copySquares[start - 1] = new fillerPiece(null);
      }
    }

    copySquares[end] = copySquares[start];
    copySquares[end].highlight = 1;
    copySquares[start] = new fillerPiece(null);
    copySquares[start].highlight = 1;

    // pawn promotion
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

  // returns true if castling is allowed
  castlingAllowed(start, end, squares) {
    const copySquares = squares.slice();
    const player = copySquares[start].player;
    const deltaPos = end - start;
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
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;
    let rowDiff = endRow - startRow;
    let colDiff = endCol - startCol;
    let rowCtr = 0;
    let colCtr = 0;
    const copySquares = squares.slice();

    while (colCtr !== colDiff || rowCtr !== rowDiff) {
      let position = 64 - startRow * 8 + -8 * rowCtr + (startCol - 1 + colCtr);
      if (
        copySquares[position].ascii !== null &&
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
    const passant = passantPos === null ? this.state.passantPos : passantPos;
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;
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
    console.log(copySquares);
    const bqrpk =
      copySquares[start].ascii.toLowerCase() === "r" ||
      copySquares[start].ascii.toLowerCase() === "q" ||
      copySquares[start].ascii.toLowerCase() === "b" ||
      copySquares[start].ascii.toLowerCase() === "p" ||
      copySquares[start].ascii.toLowerCase() === "k";
    let invalid =
      bqrpk === true && this.blockersExist(start, end, copySquares) === true;

    if (invalid) return invalid;
    const pawn = copySquares[start].ascii.toLowerCase() === "p";
    invalid =
      pawn === true &&
      this.goodPawn(start, end, copySquares, passantPos) === false;
    if (invalid) return invalid;
    const king = copySquares[start].ascii.toLowerCase() === "k";
    if (king && Math.abs(end - start) === 2)
      invalid = this.castlingAllowed(start, end, copySquares) === false;

    return invalid;
  }
  canMoveThere(start, end, squares, passantPos) {
    const copySquares = squares.slice();
    if (start === end) return false;

    const player = copySquares[start].player;
    if (
      player === copySquares[end].player ||
      copySquares[start].canMove(start, end) === false
    )
      return false;
    if (this.invalidMove(start, end, copySquares, passantPos) === true)
      return false;

    const cantCastle =
      copySquares[start].ascii === (player === "w" ? "k" : "K") &&
      Math.abs(end - start) === 2 &&
      this.inCheck(player, copySquares);
    if (cantCastle) return false;

    // king cannot castle through check
    if (
      copySquares[start].ascii === (player === "w" ? "k" : "K") &&
      Math.abs(end - start) === 2
    ) {
      const deltaPos = end - start;
      const testSquares = squares.slice();
      testSquares[start + (deltaPos === 2 ? 1 : -1)] = testSquares[start];
      testSquares[start] = new fillerPiece(null);
      if (this.inCheck(player, testSquares)) return false;
    }

    // player cannot put or keep herself in check
    const checkSquares = squares.slice();
    checkSquares[end] = checkSquares[start];
    checkSquares[start] = new fillerPiece(null);
    if (checkSquares[end].ascii === "p" && end >= 0 && end <= 7) {
      checkSquares[end] = new Queen("w");
    } else if (checkSquares[end].ascii === "P" && end >= 56 && end <= 63) {
      checkSquares[end] = new Queen("b");
    }
    if (this.inCheck(player, checkSquares) === true) return false;

    return true;
  }

  // returns true if player is in check
  inCheck(player, squares) {
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
    if (this.inCheck(player, squares)) return false;

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
    if (!this.inCheck(player, squares)) return false;
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

    if (this.state.historyNum - 1 !== this.state.trueNum) {
      return "currently viewing history";
    }

    if (this.state.mated) return "game-over";

    if (this.state.source === -1) {
      if (copySquares[i].player !== this.state.turn) return -1;

      if (copySquares[i].player !== null) {
        this.setState({
          checkFlash: false,
          justClicked: false,
          moveMade: false,
          captureMade: false,
          viewingHistory: false,
        });

        copySquares = clearCheckHighlight(copySquares, "w").slice();
        copySquares[i].highlight = 1;

        for (let j = 0; j < 64; j++) {
          if (this.canMoveThere(i, j, copySquares)) copySquares[j].possible = 1;
        }

        this.setState({
          source: i,
          squares: copySquares,
        });
      }
    }

    if (this.state.source > -1) {
      const cannibalism = copySquares[i].player === this.state.turn;
      if (cannibalism === true && this.state.source !== i) {
        copySquares[i].highlight = 1;
        copySquares[this.state.source].highlight = 0;
        copySquares = clearPossibleHighlight(copySquares).slice();
        for (let j = 0; j < 64; j++) {
          if (this.canMoveThere(i, j, copySquares)) copySquares[j].possible = 1;
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
            this.inCheck("w", copySquares) === true
          ) {
            for (let j = 0; j < 64; j++) {
              if (copySquares[j].ascii === "k") {
                copySquares[j].inCheck = 1;
                break;
              }
            }
            this.setState({
              checkFlash: true,
            });
          }
          this.setState({
            source: -1,
            squares: copySquares,
          });
          return "invalid move";
        }

        this.executeMove(this.state.turn, copySquares, this.state.source, i);

        this.setState({
          moveMade: false,
          captureMade: false,
        });
      }
    }
  }

  render() {
    const rowNums = [];
    for (let i = 8; i > 0; i--) {
      rowNums.push(<Notation key={i} value={i} />);
    }
    const colNums = [];
    for (let i = 1; i < 9; i++) {
      let letter;
      switch (i) {
        case 1:
          letter = "A";
          break;
        case 2:
          letter = "B";
          break;
        case 3:
          letter = "C";
          break;
        case 4:
          letter = "D";
          break;
        case 5:
          letter = "E";
          break;
        case 6:
          letter = "F";
          break;
        case 7:
          letter = "G";
          break;
        case 8:
          letter = "H";
          break;
        default:
          break;
      }
      colNums.push(<Notation key={letter} value={letter} />);
    }

    const board = [];
    for (let i = 0; i < 8; i++) {
      const squareRows = [];
      for (let j = 0; j < 8; j++) {
        const copySquares = this.state.squares.slice();
        let squareColor = calcSquareColor(i, j, copySquares);
        let squareCursor = "pointer";
        if (copySquares[i * 8 + j].player !== "w") squareCursor = "default";

        if (this.state.mated) squareCursor = "default";
        if (this.state.historyNum - 1 !== this.state.trueNum)
          squareCursor = "not_allowed";

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
      <div>
        <div>
          <div className={styles.left_screen}>
            <div className={styles.side_box}>
              <div className={styles.content + styles.title}>
                <p className={styles.header_2_font}>Match Information</p>
              </div>

              <div className={styles.wrapper}>
                <div className={styles.player_box}>
                  <p className={styles.medium_font}>White</p>
                </div>
                <div className={styles.black_player_color}>
                  <p className={styles.medium_font}>Black</p>
                </div>
              </div>
              <div className={styles.wrapper}>
                {this.state.turn === "w" ? (
                  <div className={styles.highlight_box}></div>
                ) : (
                  <div className={styles.transparent}></div>
                )}
                {this.state.turn === "b" ? (
                  <div className={styles.highlight_box}></div>
                ) : (
                  <div className={styles.transparent}></div>
                )}
              </div>

              <div className={styles.button_wrapper}>
                <button
                  className={styles.reset_button}
                  onClick={() => this.viewHistory("back_atw")}
                >
                  <p className={styles.button_font}>&lt;&lt;</p>
                </button>
                <button
                  className={styles.reset_button}
                  onClick={() => this.viewHistory("back")}
                >
                  <p className={styles.button_font}>&lt;</p>
                </button>
                <button
                  className={styles.reset_button}
                  onClick={() => this.reset()}
                >
                  <p className={styles.button_font}>Restart Game</p>
                </button>
                <button
                  className={styles.reset_button}
                  onClick={() => this.viewHistory("next")}
                >
                  <p className={styles.button_font}>&gt;</p>
                </button>
                <button
                  className={styles.reset_button}
                  onClick={() => this.viewHistory("next_atw")}
                >
                  <p className={styles.button_font}>&gt;&gt;</p>
                </button>
              </div>

              <div className={styles.mate_wrapper}>
                <p>
                  {this.inCheck("w", this.state.squares) &&
                  !this.checkmate("w", this.state.squares) === true
                    ? "White is in check!"
                    : ""}
                </p>
                <p>
                  {this.inCheck("b", this.state.squares) &&
                  !this.checkmate("b", this.state.squares) === true
                    ? "Black is in check."
                    : ""}
                </p>
                <p>
                  {this.checkmate("w", this.state.squares) === true
                    ? "Black won by checkmate."
                    : ""}
                </p>
                <p>
                  {this.checkmate("b", this.state.squares) === true
                    ? "White won by checkmate!"
                    : ""}
                </p>
                <p>
                  {(this.stalemate("w", this.state.squares) &&
                    this.state.turn === "w") === true
                    ? "White are in stalemate. Game over."
                    : ""}
                </p>
                <p>
                  {(this.stalemate("b", this.state.squares) &&
                    this.state.turn === "b") === true
                    ? "Black is in stalemate. Game over."
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.right_screen}>
            <div className={styles.row_label}> {rowNums} </div>
            <div className={styles.table}> {board} </div>
            <div className={styles.col_label}> {colNums} </div>
          </div>
        </div>
      </div>
    );
  }

  viewHistory(direction) {
    if (
      this.state.historyNum - 1 === this.state.trueNum &&
      this.state.turn === "1" &&
      !this.state.mated
    ) {
      return "not allowed to view history";
    }

    let copySquares = null;
    let copyWhiteCollection = null;
    let copyBlackCollection = null;

    if (direction === "back_atw") {
      copySquares = this.state.history[0].slice();
      copyWhiteCollection = [];
      copyBlackCollection = [];
    } else if (
      direction === "next_atw" &&
      this.state.historyNum < this.state.trueNum + 1
    ) {
      copySquares = this.state.history[this.state.trueNum].slice();
      copyWhiteCollection =
        this.state.historyWhiteCollection[this.state.trueNum];
      copyBlackCollection =
        this.state.historyBlackCollection[this.state.trueNum];
    } else if (direction === "back" && this.state.historyNum - 2 >= 0) {
      copySquares = this.state.history[this.state.historyNum - 2].slice();
      copyWhiteCollection =
        this.state.historyWhiteCollection[this.state.historyNum - 2];
      copyBlackCollection =
        this.state.historyBlackCollection[this.state.historyNum - 2];
    } else if (
      direction === "next" &&
      this.state.historyNum <= this.state.trueNum
    ) {
      copySquares = this.state.history[this.state.historyNum].slice();
      copyWhiteCollection =
        this.state.historyWhiteCollection[this.state.historyNum];
      copyBlackCollection =
        this.state.historyBlackCollection[this.state.historyNum];
    } else {
      return "no more history";
    }

    copySquares = clearPossibleHighlight(copySquares).slice();
    copySquares = clearHighlight(copySquares).slice();
    for (let j = 0; j < 64; j++) {
      if (copySquares[j].ascii === (this.state.turn === "w" ? "k" : "K")) {
        copySquares[j].inCheck = 0;
        copySquares[j].checked = 0;
        break;
      }
    }

    const stale =
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
    else if (direction === "next_atw") index = this.state.trueNum;

    if (index !== 0 && index !== null) {
      if (this.state.historyH1[index] !== null) {
        copySquares[this.state.historyH1[index]].highlight = 1;
        copySquares[this.state.historyH2[index]].highlight = 1;
      }
      if (this.state.historyH3[index] !== null) {
        copySquares[this.state.historyH3[index]].highlight = 1;
        copySquares[this.state.historyH4[index]].highlight = 1;
      }
    }

    let newHistoryNum =
      direction === "back"
        ? this.state.historyNum - 1
        : this.state.historyNum + 1;
    if (direction === "back_atw") newHistoryNum = 1;
    if (direction === "next_atw") newHistoryNum = this.state.trueNum + 1;

    this.setState({
      viewingHistory: true,
      justClicked: true,
      squares: copySquares,
      historyNum: newHistoryNum,
      turn: this.state.turn === "w" ? "b" : "w",
      piecesCollectedByWhite:
        copyWhiteCollection !== null
          ? copyWhiteCollection
          : this.state.piecesCollectedByWhite,
      piecesCollectedByBlack:
        copyBlackCollection !== null
          ? copyBlackCollection
          : this.state.piecesCollectedByBlack,
    });

    if (direction === "back_atw" || direction === "next_atw") {
      this.setState({
        turn: direction === "back_atw" ? "w" : this.state.trueTurn,
      });
    }
  }
}
