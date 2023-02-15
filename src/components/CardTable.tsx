import { useEffect, useContext } from "react";
import {BsTrash} from "react-icons/bs"

import Flashcard from "../flashcard";
import DataContext from "../context/DataContext";

import styles from '../styles/CardTable.module.css'

interface IProps {
    flashcards: Flashcard[],
    setFlashCards(flashcards: Flashcard[]):any
}

export default function ({flashcards, setFlashCards}: IProps) {

    const dataContext = useContext(DataContext);
    const handleDeletion = (card: Flashcard) => {
        dataContext?.deleteCard(card); 
        setFlashCards(flashcards.filter(e => e.id != card.id));
    }
    useEffect( () => {
        dataContext?.getAllFlashcards().then(data => setFlashCards(data))
    }, [])

    return (
        <table className={styles.cardTable}>
            <thead>
                <tr>
                    <th>Prompt</th>
                    <th>Answer</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    flashcards.map(card => card.prompt && card.answer && 
                    <tr> 
                        <td>{card.prompt}</td>
                        <td>{card.answer}</td> 
                        <td> <span className={styles.delete} onClick={() => handleDeletion(card)}> <BsTrash/> </span> </td> 
                    </tr>
                    )
                }
            </tbody>
        
        </table>
    )

}