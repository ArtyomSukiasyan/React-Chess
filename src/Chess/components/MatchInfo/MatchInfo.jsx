import styles from "../../Game.module.css";

export default function MatchInfo({
  turn,
  backAtw,
  back,
  reset,
  next,
  nextAtw,
}) {
  return (
    <div className={styles.left_screen}>
      <div className={styles.side_box}>
        <div className={styles.wrapper}>
          <div className={styles.player_box}>
            <p className={styles.medium_font}>White</p>
          </div>
          <div className={styles.black_player_color}>
            <p className={styles.medium_font}>Black</p>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div
            className={turn === "w" ? styles.highlight_box : styles.transparent}
          ></div>

          <div
            className={turn === "b" ? styles.highlight_box : styles.transparent}
          ></div>
        </div>

        <div className={styles.button_wrapper}>
          <button className={styles.reset_button} onClick={backAtw}>
            <p>&lt;&lt;</p>
          </button>
          <button className={styles.reset_button} onClick={back}>
            <p>&lt;</p>
          </button>
          <button className={styles.reset_button} onClick={reset}>
            <p>Restart Game</p>
          </button>
          <button className={styles.reset_button} onClick={next}>
            <p>&gt;</p>
          </button>
          <button className={styles.reset_button} onClick={nextAtw}>
            <p>&gt;&gt;</p>
          </button>
        </div>
      </div>
    </div>
  );
}
