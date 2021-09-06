import styles from "../../Game.module.css";

export default function Square(props) {
  if (props.value !== null) {
    return (
      <div
        className={`${styles.square} ${styles[props.color]} ${
          styles[props.cursor]
        }`}
        onClick={props.onClick}
      >
        {props.value.icon}
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.square} ${styles[props.color]} ${
          styles[props.cursor]
        }`}
        onClick={props.onClick}
      ></div>
    );
  }
}
