import DataContext from "../../context/DataContext";
import { useState, useContext, useEffect } from "react";

import { ICollection } from "../../collection";
import Flashcard from "../../flashcard";

import styles from '../../styles/Review.module.css'

import MultipleChoice from "./MultipleChoice";

interface IProps {
    collection: ICollection;
    handleCollectionModification(collection: ICollection):void
}

enum ReviewModes {
    Multi = "Multi",
    Input = "Input", 
    Confidence = "Confidence"
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


export default function QuizSelector ( {collection, handleCollectionModification}: IProps ) {
    
    const [reviewMode, setReviewMode] = useState<ReviewModes>(ReviewModes.Multi)

    const dataContext = useContext(DataContext);

    const [filtered, setFiltered] = useState<Flashcard[]>(collection.flashcards.filter(card => new Date(card.nextReview) < new Date()));
    const [question, setQuestion] = useState<Flashcard>(shuffle(filtered)[0])
    const [choices, setChoices] = useState<Flashcard[]>([])
    
    const [answered, setAnswered] = useState(0);

    const saveChanges = (collection: ICollection) => {
        handleCollectionModification(collection)
        dataContext?.saveCollection(collection);
        setAnswered(answered+1);
    }

    useEffect(() => {
        setFiltered(shuffle(collection.flashcards.filter(card => new Date(card.nextReview) < new Date())))
    }, [collection])
    
    useEffect(() => {
        setFiltered([...collection.flashcards.filter(card => new Date(card.nextReview) < new Date())]), [answered]
    }, [answered])

    useEffect(() => {
        if (!collection || !question || filtered.length == 0) return;                

        setQuestion(filtered[0])

        if (question.id == filtered[0].id)
        {
            const timeout = setTimeout(() => {  
                setChoices([...shuffle([...collection.flashcards.filter(c=>c.id!=question.id).slice(0,5), question])])       
                Array.from(document.getElementsByClassName(styles.correct)).forEach(element => element.className = styles.choice)
                Array.from(document.getElementsByClassName(styles.incorrect)).forEach(element => element.className = styles.choice)                
            }, 500);
        }
    }, [filtered])

    useEffect(() => {
        const timeout = setTimeout(() => {  
            console.debug("clearing")
            if (!collection || !question) return;
            setChoices([...shuffle([...collection.flashcards.filter(c=>c.id!=question.id).slice(0,5), question])])       
            Array.from(document.getElementsByClassName(styles.correct)).forEach(element => element.className = styles.choice)
            Array.from(document.getElementsByClassName(styles.incorrect)).forEach(element => element.className = styles.choice)
        }, 500);
    }, [question])

    return (
    <> 
    {
    
        filtered.length > 0 ? 
        <>
            <div className={styles.heading}> <h5> Review </h5> </div>
            <div className={styles.quizSelector}>
                <button onFocus={()=>setReviewMode(ReviewModes.Multi)}> Multiple Choice </button>
                <button onFocus={()=>setReviewMode(ReviewModes.Input)}> Input Review </button>
                <button onFocus={()=>setReviewMode(ReviewModes.Confidence)}> Confidence Review </button>
            </div>
    
            {
                reviewMode == ReviewModes.Multi &&
                <MultipleChoice 
                    collection={collection}
                    choices={choices}
                    question={question} 
                    handleCollectionModification={saveChanges} />
            }
        
        </> : <div className={styles.heading}> <h5> Nothing left to review! </h5> </div>

    }
    </>
    )
}