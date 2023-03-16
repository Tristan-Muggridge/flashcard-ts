
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

    const handleAnswer = (difficulty: Difficulty) => {
        
        switch (difficulty) {
            case Difficulty.Again:
                question.answeredIncorrectly()
                break;
            case Difficulty.Hard:
                question.answeredIncorrectly()
                break;
            case Difficulty.Good:
                question.answeredCorrectly()
                break;
            case Difficulty.Easy:
                question.answeredCorrectly()
                break;
        }
    
        handleCollectionModification(collection);
    }   
    
    
    return (
        <div className={styles.ConfidenceReview}>

            <div className={styles.heading}> <h5> {question.answer} </h5> </div>

            <div className={styles.buttonContainer}>
                <button onClick={() => handleAnswer(Difficulty.Again)} className={styles.again}> {Difficulty.Again} </button>
                <button onClick={() => handleAnswer(Difficulty.Hard)}  className={styles.hard}>  {Difficulty.Hard} </button>
                <button onClick={() => handleAnswer(Difficulty.Good)}  className={styles.good}>  {Difficulty.Good} </button>
                <button onClick={() => handleAnswer(Difficulty.Easy)}  className={styles.easy}>  {Difficulty.Easy} </button>
            </div>
        </div>
    )
}