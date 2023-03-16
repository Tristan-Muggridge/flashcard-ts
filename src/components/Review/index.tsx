import DataContext from "../../context/DataContext";
import { useState, useContext, useEffect } from "react";

import { ICollection } from "../../collection";
import Flashcard from "../../flashcard";

import styles from '../../styles/Review.module.css'

import MultipleChoice from "./MultipleChoice";
import InputReview from "./InputReview";
import ConfidenceReview from "./ConfidenceReview";

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
                Array.from(document.getElementsByClassName(styles.correct)).forEach(element => element.className = styles.choice)
                Array.from(document.getElementsByClassName(styles.incorrect)).forEach(element => element.className = styles.choice)                
            }, 500);
        }
    }, [filtered])

    useEffect(() => {
        const timeout = setTimeout(() => {  
            if (!collection || !question) return;
            Array.from(document.getElementsByClassName(styles.correct)).forEach(element => element.className = styles.choice)
            Array.from(document.getElementsByClassName(styles.incorrect)).forEach(element => element.className = styles.choice)
            // Array.from(document.getElementsByClassName(styles.inputReviewCorrect)).forEach(element => element.className = styles.inputReviewNeutral)
            // Array.from(document.getElementsByClassName(styles.inputReviewInCorrect)).forEach(element => element.className = styles.inputReviewNeutral)
        }, 500);
    }, [question])

    return (
    <> 
    {
    
        filtered.length > 0 ? 
        <>
            <div className={styles.heading}> <h2> Review </h2> </div>
            <div className={styles.quizSelector}>
                <button className={reviewMode == ReviewModes.Multi ? styles.active : ''} onFocus={()=>setReviewMode(ReviewModes.Multi)}> Multiple Choice </button>
                <button className={reviewMode == ReviewModes.Input ? styles.active : ''} onFocus={()=>setReviewMode(ReviewModes.Input)}> Input Review </button>
                <button className={reviewMode == ReviewModes.Confidence ? styles.active : ''} onFocus={()=>setReviewMode(ReviewModes.Confidence)}> Confidence Review </button>
            </div>
    
            {question && <div className={styles.heading}> <h3> {question.prompt} </h3> </div>}

            {
                reviewMode == ReviewModes.Multi &&
                <MultipleChoice 
                    collection={collection}
                    question={question} 
                    handleCollectionModification={saveChanges} />
            }

            {
                reviewMode == ReviewModes.Input &&
                <InputReview 
                    collection={collection}
                    question={question} 
                    handleCollectionModification={saveChanges} />
            }

            {
                reviewMode == ReviewModes.Confidence &&
                <ConfidenceReview 
                    collection={collection}
                    question={question} 
                    handleCollectionModification={saveChanges} />
            }
        
        </> : <div className={styles.heading}> <h5> Nothing left to review! </h5> </div>

    }
    </>
    )
}