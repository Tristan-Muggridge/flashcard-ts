import { useContext, useState, useRef } from "react"
import { BsCheck } from 'react-icons/bs'

import DataContext, { IDataContext } from "../context/DataContext"

import styles from '../styles/FlashCardComposeForm.module.css'
import Flashcard from "../flashcard"
import { ICollection } from "../collection"

interface IProps {
    activeCollection: ICollection
}

export default function ({activeCollection}: IProps) {
    const dataContext = useContext(DataContext)
    
    const [prompt, setPrompt] = useState('')
    const [answer, setAnswer] = useState('')

    const promptRef = useRef<HTMLLabelElement | null>(null)

    const handleSubmit = (e: any) => {
        e.preventDefault(); 
        const card = new Flashcard(prompt, answer);
        dataContext?.createCard(activeCollection, card).then(card => activeCollection.flashcards.push(card));
        if (promptRef.current) promptRef.current.focus();
    }

    return (
        <form className={styles.cardForm} onSubmit={handleSubmit}>
            <label ref={promptRef} style={{gridRow: 1}} htmlFor="prompt"> Prompt: </label>
            <input style={{gridRow: 2}} id="prompt" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}/>

            <label style={{gridRow: 1}} htmlFor="answer"> Answer: </label>
            <input style={{gridRow: 2}} id="answer" type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}/>

            <button style={{gridColumn: 3, gridRow: 2}} type="submit"> <BsCheck /> </button>
        </form>
    )

}