import { useEffect, useRef, useState } from "react";
import Flashcard from "../../flashcard"
import Collection from "../../collection";

import styles from '../../styles/Review.module.css'

interface IProps {
    collection: Collection;
    question: Flashcard;
    handleCollectionModification(collection: Collection):void
}

export default function MultipleChoice({collection, question, handleCollectionModification}: IProps) {
    const multipleChoiceArea = useRef<HTMLDivElement>(null);
    const answer = useRef<HTMLButtonElement>(null);

    let choices:Flashcard[] = collection.flashcards;

    const handleKeyDown = (key: React.KeyboardEvent<HTMLDivElement>) => {
        switch(key.key) {
            case '1': 
                handleAnswer(0);
                break;
            case '2': 
                handleAnswer(1);
                break;
            case '3': 
                handleAnswer(2);
                break;
            case '4': 
                handleAnswer(3);
                break;
            case '5': 
                handleAnswer(4);
                break;
            case '6': 
                handleAnswer(5);
                break;
            default: 
                break;
        }
    }

    console.debug(question.answer)

    const handleAnswer = (e: any) => {
        answer.current?.classList.add(styles.correct)
        if (!choices) return;

        if (choices[e].answer != question.answer) {
            Array.from(document.getElementsByClassName(styles.choice))[e].className = `${styles.incorrect} ${styles.choice}`;
        }

        setTimeout(()=> {
            choices[e].answer == question.answer
            ? Flashcard.answeredCorrectly(question)
            : Flashcard.answeredIncorrectly(question);        
    
            handleCollectionModification(collection);

            // choices = [...collection.flashcards.filter(c=>c.id!=question.id).slice(0, 4), question]
        }, 500)
    }   

    return <div className={styles.multipleChoice} ref={multipleChoiceArea} onKeyDown={handleKeyDown} tabIndex={0}>
        {   question && choices && 
        <>
            <div className={styles.choicesGrid}>
                {choices.map((card, index: number) => 
                    <button 
                        ref={ card.id == question.id ? answer : null }
                        key={card.id} 
                        className={styles.choice}
                        onClick={(e) => handleAnswer(index)}>
                        {card.answer}
                    </button>
                )}
            </div>
        </>
        }
        
    </div>
}