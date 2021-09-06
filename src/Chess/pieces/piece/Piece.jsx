export default class filler_piece {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon = null;
    this.ascii = null;
  }

  canMove(start, end) {
    return false;
  }
}
