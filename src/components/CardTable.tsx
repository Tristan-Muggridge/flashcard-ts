import { useContext, useState, useRef } from "react";
import { BsFillPencilFill, BsTrash, BsX, BsXLg, BsPlusLg } from "react-icons/bs"

import Flashcard, { IFlashcard } from "../flashcard";

import styles from '../styles/CardTable.module.css'

interface IProps {
    flashcards: Flashcard[],
    handleCardModification(card: IFlashcard[]):any
}

export default function ({flashcards, handleCardModification}: IProps) {

    const [newPrompt, setNewPrompt] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    const [editing, setEditing] = useState(-1);

    const newPromptInputRef = useRef<HTMLInputElement | null>(null)

    const handlePlusOnClick = () => {
        handleCardModification( [...flashcards, new Flashcard(newPrompt, newAnswer)])
        setNewAnswer('');
        setNewPrompt('');
        newPromptInputRef.current?.focus();
    }

    const handleDeletionOnClick = (card: Flashcard, index: number) => {
        const updatedCards = flashcards;
        updatedCards.splice(index, 1);
        handleCardModification(updatedCards);
    }

    const handleUpdate = (card: Flashcard, index: number) => {
        const updatedCards = flashcards
        updatedCards[index] = card
        handleCardModification(updatedCards)
        setEditing(-1);
    }
    
    return (
        <>
        <table className={styles.cardTable}>
            <thead>
                <tr>
                    <th>Prompt</th>
                    <th>Answer</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr> 
                    <td> <input ref={newPromptInputRef} onKeyDown={e=> e.key == "Enter" ? handlePlusOnClick() : '' } type="text" name="new-card-prompt" id="new-card-prompt" placeholder="new prompt..." value={newPrompt} onChange={e => setNewPrompt(e.target.value)}/> </td>
                    <td> <input onKeyDown={e=> e.key == "Enter" ? handlePlusOnClick() : '' } type="text" name="new-card-answer" id="new-card-answer" placeholder="new answer..." value={newAnswer} onChange={e => setNewAnswer(e.target.value)}/> </td>
                    <td> 
                        <span className={styles.plus} onClick={() => handlePlusOnClick() }> <BsPlusLg/> </span>
                        <span className={styles.delete} onClick={() => {setNewAnswer(''); setNewPrompt('')}}> <BsXLg/> </span> 
                    </td> 
                </tr>

                {
                    flashcards.map((card, index) => card.prompt && card.answer && 
                    <tr key={card.id}> 
                        <td>{card.prompt}</td>
                        <td>{card.answer}</td> 
                        <td> 
                            <span className={styles.edit} onClick={() => setEditing(index) }> <BsFillPencilFill/> </span>
                            <span className={styles.delete} onClick={() => handleDeletionOnClick(card, index)}> <BsTrash/> </span> 
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
    return  <div className={styles.editModal}>
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