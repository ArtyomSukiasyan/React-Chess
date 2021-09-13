import styles from "../../Game.module.css";

export default function Square({ key, value, color, cursor, onClick }) {
  if (value !== null) {
    return (
      <div
      key= {key}
        className={`${styles.square} ${styles[color]} ${cursor}`}
        onClick={onClick}
      >
        {value.icon}
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.square} ${styles[color]} ${cursor}`}
        onClick={onClick}
      ></div>
    );
  }
}
