import { useEffect, useRef, useState } from "react";
import Flashcard from "../../flashcard"
import Collection from "../../collection";

import styles from '../../styles/Review.module.css'

interface IProps {
    collection: Collection;
    question: Flashcard;
    handleCollectionModification(collection: Collection):void
}

const shuffle = (array: Flashcard[]) => {
    if (array.length == 0) return array;

    let currentIndex = array.length,  randomIndex;
    
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    
    return array;
}

export default function MultipleChoice({collection, question, handleCollectionModification}: IProps) {
    const multipleChoiceArea = useRef<HTMLDivElement>(null);
    const answer = useRef<HTMLButtonElement>(null);

    const [choices, setChoices] = useState<Flashcard[]>(collection.flashcards)

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

    console.debug("MultipleChoice \n", collection, question)

    const handleAnswer = (e: any) => {
        answer.current?.classList.add(styles.correct)
        if (!choices) return;

        if (choices[e].answer != question.answer) {
            Array.from(document.getElementsByClassName(styles.choice))[e].className = `${styles.incorrect} ${styles.choice}`;
        }

        choices[e].answer == question.answer
            ? Flashcard.answeredCorrectly(question)
            : Flashcard.answeredIncorrectly(question);        
    
        handleCollectionModification(collection);
    }   

    useEffect(()=> {
        console.debug("effect triggered")
        console.debug(question)

        console.debug("MultipleChoice \n", collection, question)

        const timeout = setTimeout(() => {
            const shuffled = shuffle([...collection.flashcards.filter(c=>c.id!=question.id).slice(0,5), question])
            setChoices(collection.flashcards);       
        }, 500);
    }, [collection, question])

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