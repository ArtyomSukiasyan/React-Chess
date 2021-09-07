import styles from "../../Game.module.css";

export default function Square({ key, value, color, cursor, onClick }) {
  if (value !== null) {
    return (
      <div
        className={`${styles.square} ${styles[color]} ${styles[cursor]}`}
        onClick={onClick}
      >
        {value.icon}
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.square} ${styles[color]} ${styles[cursor]}`}
        onClick={onClick}
      ></div>
    );
  }
}
