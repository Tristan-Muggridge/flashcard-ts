import { useRef } from "react";
import Flashcard from "../../flashcard"
import { ICollection } from "../../collection";

import styles from '../../styles/Review.module.css'

interface IProps {
    collection: ICollection;
    choices: Flashcard[];
    question: Flashcard;
    handleCollectionModification(collection: ICollection):void
}


export default function MultipleChoice({collection, choices, question, handleCollectionModification}: IProps) {
    const multipleChoiceArea = useRef<HTMLDivElement>(null);
    const answer = useRef<HTMLDivElement>(null);

    

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

    const handleAnswer = (e: any) => {
        answer.current?.classList.add(styles.correct)
        
        if (choices[e].answer != question.answer) {
            Array.from(document.getElementsByClassName(styles.choice))[e].className = `${styles.incorrect} ${styles.choice}`;
        }

        choices[e].answer == question.answer
            ? question.answeredCorrectly()
            : question.answeredIncorrectly()        
    
        handleCollectionModification(collection);
    }

    return <div className={styles.multipleChoice} ref={multipleChoiceArea} onKeyDown={handleKeyDown} tabIndex={0}>
        <h1> Multiple Choice </h1>
        {   question &&
        <>
            <div className={styles.heading}> <h5> { question && question.prompt } </h5> </div>

            <div className={styles.choicesGrid}>
                {choices.map((card, index: number) => 
                    <div 
                        ref={ card.id == question.id ? answer : null }
                        key={card.id} 
                        className={styles.choice}
                        onClick={(e) => handleAnswer(index)}>
                        {card.answer}
                    </div>
                )}
            </div>
        </>
        }
        
    </div>
}