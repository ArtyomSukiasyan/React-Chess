export default function calcSquareColor(i, j, squares) {
  let squareColor =
    (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j))
      ? "white_square"
      : "black_square";
  if (squares[i * 8 + j].highlight === 1) {
    squareColor =
      (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j))
        ? "selected_white_square"
        : "selected_black_square";
  }
  if (squares[i * 8 + j].possible === 1) {
    squareColor =
      (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j))
        ? "highlighted_white_square"
        : "highlighted_black_square";
  }
  if (
    squares[i * 8 + j].ascii !== null &&
    squares[i * 8 + j].ascii.toLowerCase() === "k"
  ) {
    if (squares[i * 8 + j].in_check === 1) {
      squareColor =
        (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j))
          ? "in_check_square_white"
          : "in_check_square_black";
    }
    if (squares[i * 8 + j].checked >= 1) {
      squareColor =
        squares[i * 8 + j].checked === 1 ? "checked_square" : "stale_square";
    }
  }
  function isEven(value) {
    return value % 2;
  }
  return squareColor;
}
