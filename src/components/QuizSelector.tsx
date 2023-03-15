import { IFlashcard } from "../flashcard";

import styles from '../styles/QuizSelector.module.css'

interface IProps {
    cards: IFlashcard[]
}

export default function QuizSelector ({cards}: IProps) {
    return (
        <div className={styles.quizSelector}>
            <button> Multiple Choice </button>
            <button> Speed Review </button>
            <button> Standard </button>
        </div>
    )
}