import { useEffect, useRef, useState } from "react";
import Flashcard from "../../flashcard"
import { ICollection } from "../../collection";

import styles from '../../styles/Review.module.css'

interface IProps {
    collection: ICollection;
    question: Flashcard;
    handleCollectionModification(collection: ICollection):void
}

export default function InputReview ({collection, question, handleCollectionModification}: IProps) {

    const [response, setResponse] = useState("");
    const inputField = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: any) => {
        e.preventDefault();
                
        if (response == question.answer) {
            inputField.current?.classList.add(styles.inputReviewCorrect)
            question.answeredCorrectly()
        } else {
            inputField.current?.classList.add(styles.inputReviewInCorrect)
            question.answeredIncorrectly()
        }

        handleCollectionModification(collection);
        setResponse('')
    }

    useEffect(()=> inputField.current?.focus(), [])

    return <div>
        <form onSubmit={handleSubmit} className={styles.inputReview}>
            <label htmlFor="response">Response:</label>
            <input ref={inputField} type="text" id="response" value={response} onChange={(e)=>setResponse(e.target.value)} />
        </form>
</div>

}