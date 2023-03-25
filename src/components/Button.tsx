
import styles from '../styles/Button.module.css'

interface IProps {

    caption: string;
    onClick: () => void;

}

export default function Button ({caption, onClick}: IProps) {
    return (
        <button onClick={onClick} className={styles.Button}>
            {caption}
        </button>
    )
}