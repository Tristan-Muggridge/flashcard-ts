import { IFlashcard } from "../flashcard";

import styles from '../styles/QuizSelector.module.css'

export default function QuizSelector () {
    return (
        <div className={styles.quizSelector}>
            <button> Multiple Choice </button>
            <button> Speed Review </button>
            <button> Standard </button>
        </div>
    )
}