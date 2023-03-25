
import { useEffect, useRef, useState } from "react";
import Flashcard from "../../flashcard"
import { ICollection } from "../../collection";

import styles from '../../styles/Review.module.css'

interface IProps {
    collection: ICollection;
    question: Flashcard;
    handleCollectionModification(collection: ICollection):void
}

enum Difficulty {
    Again = "Again",
    Hard = "Hard",
    Good = "Good",
    Easy = "Easy"
}

export default function ConfidenceReview ({collection, question, handleCollectionModification}:IProps) {

    const [reveal, setReveal] = useState(false);
    const handleAnswer = (difficulty: Difficulty) => {
        
        switch (difficulty) {
            case Difficulty.Again:
                Flashcard.answeredIncorrectly(question);
                break;
            case Difficulty.Hard:
                Flashcard.answeredIncorrectly(question);
                break;
            case Difficulty.Good:
                Flashcard.answeredCorrectly(question);
                break;
            case Difficulty.Easy:
                Flashcard.answeredCorrectly(question);
                break;
        }
        
        setReveal(false);
        handleCollectionModification(collection);
    }   
    
    
    return (
        <div className={styles.ConfidenceReview} tabIndex={0}>

            { reveal == true && <div className={styles.heading}> <h5> {question.answer} </h5> </div>}

            <div className={styles.buttonContainer}>
            {
                !reveal && <button onClick={() => setReveal(true)} className={styles.neutral} > Show Answer </button>
            }

            {
                reveal == true && <>
                <button onClick={() => handleAnswer(Difficulty.Again)} className={styles.again}> {Difficulty.Again} </button>
                <button onClick={() => handleAnswer(Difficulty.Hard)}  className={styles.hard}>  {Difficulty.Hard} </button>
                <button onClick={() => handleAnswer(Difficulty.Good)}  className={styles.good}>  {Difficulty.Good} </button>
                <button onClick={() => handleAnswer(Difficulty.Easy)}  className={styles.easy}>  {Difficulty.Easy} </button>
                </>
            }
            </div>
        </div>
    )
}