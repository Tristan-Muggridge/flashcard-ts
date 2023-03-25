import DataContext, { IDataContext } from "../../context/DataContext";
import { useState, useContext} from "react";

import Collection from "../../collection";
import Flashcard from "../../flashcard";

import styles from '../../styles/Review.module.css'

import MultipleChoice from "./MultipleChoice";
import InputReview from "./InputReview";
import ConfidenceReview from "./ConfidenceReview";

interface IProps {
    collection: Collection;
    handleCollectionModification(collection: Collection, dataContext: IDataContext):void
}

enum ReviewModes {
    Multi = "Multi",
    Input = "Input", 
    Confidence = "Confidence",
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

const filterCards = (card: Flashcard) => {
    const now = new Date();
    return new Date(card.nextReview) < now ? true : false;
}

export default function QuizSelector ( {collection, handleCollectionModification}: IProps ) {
    const dataContext = useContext(DataContext);

    const [reviewMode, setReviewMode] = useState<ReviewModes>(ReviewModes.Multi)
    const [answered, setAnswered] = useState(0);

    const filtered = [...shuffle(collection.flashcards.filter(filterCards))];
    const question = filtered[Math.floor(Math.random() * filtered.length)];

    const saveChanges = (collection: Collection) => {
        handleCollectionModification(collection, dataContext as IDataContext)
        setAnswered(answered+1);
        
        Array.from(document.getElementsByClassName(styles.correct)).forEach(element => element.className = styles.choice)
        Array.from(document.getElementsByClassName(styles.incorrect)).forEach(element => element.className = styles.choice)
        Array.from(document.getElementsByClassName(styles.inputReviewCorrect)).forEach(element => element.className = styles.neutral)
        Array.from(document.getElementsByClassName(styles.inputReviewInCorrect)).forEach(element => element.className = styles.neutral)

        const timeout = setTimeout(() => {                  
        }, 500);
    }

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
            
            {   reviewMode == ReviewModes.Multi && "question" &&
                        <MultipleChoice 
                            collection={collection}
                            question={question}
                            handleCollectionModification={saveChanges} />
            }
            {
                reviewMode == ReviewModes.Input && question &&
                <InputReview 
                    collection={collection}
                    question={question} 
                    handleCollectionModification={saveChanges} />
            }

            {
                reviewMode == ReviewModes.Confidence && question &&
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