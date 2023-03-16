import DataContext, { ICollections } from "../context/DataContext";
import { useContext, useState, useRef, useEffect } from "react";
import { BsFillPencilFill, BsTrash, BsX, BsXLg, BsPlusLg } from "react-icons/bs"
import Collection from "../collection";

import Flashcard from "../flashcard";
import EditModal from "./EditModal";

import styles from '../styles/CardTable.module.css'

interface IProps {
    collection: Collection,
    handleCollectionModification(collection: Collection):any
}

export default function ({collection, handleCollectionModification}: IProps) {

    const dataContext = useContext(DataContext);

    const [newPrompt, setNewPrompt] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [editing, setEditing] = useState(-1);

    const newPromptInputRef = useRef<HTMLInputElement | null>(null)

    const saveChanges = (collection: Collection) => {
        handleCollectionModification(collection)
        dataContext?.saveCollection(collection);
    }

    const handlePlusOnClick = () => {
        const updated = collection
        updated.flashcards = [...collection.flashcards, new Flashcard(newPrompt, newAnswer)]
        saveChanges(updated);

        setNewAnswer('');
        setNewPrompt('');
        newPromptInputRef.current?.focus();
    }

    const handleDeletionOnClick = (index: number) => {
        const updatedCards = collection.flashcards;
        updatedCards.splice(index, 1);

        collection.flashcards = updatedCards;
        saveChanges(collection)
    }

    const handleUpdate = (card: Flashcard, index: number) => {
        const updatedCards = collection.flashcards;
        updatedCards[index] = card;
        setEditing(-1);

        collection.flashcards = updatedCards;
        saveChanges(collection)
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
                    collection && collection.flashcards.map((card, index) => card.prompt && card.answer && 
                    <tr key={card.id}> 
                        <td>{card.prompt}</td>
                        <td>{card.answer}</td> 
                        <td> 
                            <span className={styles.edit} onClick={() => setEditing(index) }> <BsFillPencilFill/> </span>
                            <span className={styles.delete} onClick={() => handleDeletionOnClick(index)}> <BsTrash/> </span> 
                        </td>
                        
                    </tr>
                    )
                }
            </tbody>
        </table>
        
        {editing > -1 && <EditModal initialObject={JSON.parse(JSON.stringify(collection.flashcards[editing]))} handleSubmit={(e: Flashcard)=> handleUpdate(e, editing)} openState={()=>setEditing(-1)}/>}

        </>
    )
}

