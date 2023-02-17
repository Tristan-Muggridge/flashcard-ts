import { useEffect, useContext, useState } from "react";
import {BsFillPencilFill, BsTrash, BsX} from "react-icons/bs"

import Flashcard, { IFlashcard } from "../flashcard";
import DataContext from "../context/DataContext";

import styles from '../styles/CardTable.module.css'

interface IProps {
    flashcards: Flashcard[],
    setFlashCards(flashcards: Flashcard[]):any
}

export default function ({flashcards, setFlashCards}: IProps) {

    const dataContext = useContext(DataContext);

    const [editing, setEditing] = useState(-1);

    const handleDeletion = (card: Flashcard, index: number) => {
        dataContext?.deleteCard(card); 
        const updatedCards = flashcards
        updatedCards.splice(index, 1);
        setFlashCards([...updatedCards])
    }

    const handleUpdate = (card: Flashcard, index: number) => {
        const updatedCards = flashcards
        updatedCards[index].correctQty++;;
        dataContext?.updateCard(card, index); 
        setFlashCards([...updatedCards])
        setEditing(-1);
    }

    useEffect( () => {
        // dataContext?.getAllFlashcards().then(data => setFlashCards(data))
    }, [])

    return (
        <>
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
                    flashcards.map((card, index) => card.prompt && card.answer && 
                    <tr key={card.id}> 
                        <td>{card.prompt}</td>
                        <td>{card.answer}</td> 
                        <td> 
                            <span className={styles.edit} onClick={() => /*handleUpdate(card, index)*/ setEditing(index) }> <BsFillPencilFill/> </span>
                            <span className={styles.delete} onClick={() => handleDeletion(card, index)}> <BsTrash/> </span> 
                        </td> 
                    </tr>
                    )
                }
            </tbody>
        </table>

        {
            editing > -1 && <EditModal card={flashcards[editing]} index={editing} handleSubmit={handleUpdate} close={()=>setEditing(-1)}/>
        }
        </>
    )
}

const EditModal = ({card, index, handleSubmit, close}: {card: IFlashcard, index: number, close():void, handleSubmit(card: IFlashcard, index: number):void}) => {    
    return <div className={styles.editModal}>
            <div className={styles.close} onClick={close}> <BsX /> </div>
        <form onSubmit={(e: any) => {e.preventDefault(); card.prompt = e.target.prompt.value; card.answer = e.target.answer.value; handleSubmit(card, index)}}>
            <label htmlFor="prompt">Prompt</label>
            <input type="text" id="prompt" />
            <label htmlFor="answer">Answer</label>
            <input type="text" id="answer" />
            <label htmlFor="active">Active</label>
            <input type="checkbox" id="active" />
            <button> Save Changes </button>
        </form>
    </div>
}