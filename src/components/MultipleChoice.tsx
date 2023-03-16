import DataContext, { ICollections } from "../context/DataContext";
import { useContext, useEffect, useRef, useState } from "react";
import Flashcard, { IFlashcard } from "../flashcard"
import styles from '../styles/MultipleChoice.module.css'
import Collection, { ICollection } from "../collection";

interface IProps {
    collection: ICollection;
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

export default function MultipleChoice({collection, handleCollectionModification}: IProps) {
    const dataContext = useContext(DataContext);

    const [filtered, setFiltered] = useState<Flashcard[]>([]);
    const [shuffled, setShuffled] = useState<Flashcard[]>([]);
    
    const [question, setQuestion] = useState(shuffled[0])
    const [choices, setChoices] = useState<Flashcard[]>([])
    
    const [answered, setAnswered] = useState(0);

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

    const saveChanges = (collection: Collection) => {
        handleCollectionModification(collection)
        dataContext?.saveCollection(collection);
    }

    const handleAnswer = (e: any) => {
        answer.current?.classList.add(styles.correct)
        
        if (choices[e].id != question.id) {
            Array.from(document.getElementsByClassName(styles.choice))[e].className = `${styles.incorrect} ${styles.choice}`;
        }

        choices[e].id == question.id
            ? question.answeredCorrectly()
            : question.answeredIncorrectly()        
    
        saveChanges(collection);
        setAnswered(answered+1)
    }

    useEffect(() => {
        setFiltered(collection.flashcards.filter(card => new Date(card.nextReview) < new Date()))
        setShuffled(shuffle(filtered))
        setQuestion(filtered[0])
        setShuffled(shuffle(filtered))
        multipleChoiceArea.current?.focus();
    }, [collection])
    
    useEffect(() => {
        setFiltered([...collection.flashcards.filter(card => new Date(card.nextReview) < new Date())]), [answered]}
    , [answered])

    useEffect(() => {
        if (!collection || !question) return;
        setQuestion([...filtered][0])

        if (question.id == filtered[0].id)
        {
            const timeout = setTimeout(() => {  

                if (!collection || !question) return;
                setChoices([...shuffle([...collection.flashcards.filter(c=>c.id!=question.id).slice(0,5), question])])       
                Array.from(document.getElementsByClassName(styles.correct)).forEach(element => element.className = styles.choice)
                Array.from(document.getElementsByClassName(styles.incorrect)).forEach(element => element.className = styles.choice)
            }, 500);
        }
    }, [filtered])

    useEffect(() => {
        const timeout = setTimeout(() => {  
        if (!collection || !question) return;
            setChoices([...shuffle([...collection.flashcards.filter(c=>c.id!=question.id).slice(0,5), question])])       
            Array.from(document.getElementsByClassName(styles.correct)).forEach(element => element.className = styles.choice)
            Array.from(document.getElementsByClassName(styles.incorrect)).forEach(element => element.className = styles.choice)
        }, 500);
    }, [question])

    return <div className={styles.multipleChoice} ref={multipleChoiceArea} onKeyDown={handleKeyDown} tabIndex={0}>
        <h1> Multiple Choice </h1>
        {   question && filtered.length > 0 ?
        <>
            <h5> { question && question.prompt } </h5>

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
        :
        <>
            <h5> Nothing left to review! </h5>
        </>
        }
        
    </div>
}