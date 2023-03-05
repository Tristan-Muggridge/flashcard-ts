import { useEffect, useRef, useState } from 'react';
import {BsThreeDots} from 'react-icons/bs'
import { ICollection } from '../collection';
import styles from '../styles//Collection.module.css'
import Flashcard, { IFlashcard } from '../flashcard';

interface IProps {
    collection: ICollection, 
    handleCardModification(card: IFlashcard[]):any, 
    toggleVisibility(): any,
    handleCollectionDeletion(id: any):any
}
const ContextMenu = ({collection, handleCardModification, toggleVisibility, handleCollectionDeletion}: IProps) => {
    
    const importButtonRef = useRef<HTMLInputElement | null>(null)
    const handleCSVImport = (e: any) => {
        const reader = new FileReader();
        
        reader.onload = async(e: any) => {
            const text = (e.target.result) 

            const splitText = text.split(",");
            const cards = [];

            let rows = 0;

            while (splitText.length > 1) {
                const [id, prompt, answer, streak, correctQty, incorrectQty, lastReview] = splitText.splice(0, 7);
                if (rows > 0) cards.push( new Flashcard(prompt, answer, id.split('\r\n')[1], streak, correctQty, incorrectQty, new Date(lastReview)) )
                rows++;
            }

           

            handleCardModification( [...collection.flashcards, ...cards] )
            toggleVisibility();
        }

        reader.readAsText(e.target.files[0])
    }

    const handleCSVExport = () => {

        let cards = collection.flashcards.map(card => 
            `${card.id},${card.prompt},${card.answer},${card.streak},${card.correctQty},${card.incorrectQty},${card.lastReview},`
        ).join("\n")

        let csvContent = `data:text/csv;charset=utf-8,\nid,prompt,answer,streak,correctQty,incorrectQty,lastReview,\n${cards}`
        const encoded = encodeURI(csvContent)

        const link = document.createElement('a');
        link.setAttribute('href', encoded);
        link.setAttribute('download', `${collection.name}.csv`);
        link.setAttribute('style', 'display: none;')
        document.body.appendChild(link);

        link.click();
        toggleVisibility();
    }

    return (
        <div className={styles.contextMenu}>
            <ul>
                <li onClick={()=> alert(`Edit, ${collection.id}`)}>Edit</li>
                <li onClick={()=> handleCollectionDeletion(collection.id)}>Delete</li>
                <li onClick={handleCSVExport}>Export CSV</li>
                <li onClick={()=> importButtonRef.current?.click()}> <input ref={importButtonRef} onChange={handleCSVImport} style={{display: "none"}} type="file" name="csv" id="" /> Import CSV </li>
            </ul>
        </div>
    )
}

interface mainProps {collection?: ICollection, content: any, handleClick:any, handleCardModification(card: IFlashcard[]):any, handleCollectionDeletion(id:any):any, active:boolean}
export default function ({collection, content, handleClick, handleCardModification, handleCollectionDeletion, active}: mainProps) {
    const [showContextMenu, setShowContextMenu] = useState(false);

    return (
        <div className={`${styles.collection} ${active ? styles.active : ''}`} onClick={()=>handleClick(collection)}>
        {
            collection ? 
            <div>
                <span className={styles.elipses} onClick={ () => setShowContextMenu(!showContextMenu)}> <BsThreeDots /> </span>
                { showContextMenu && <ContextMenu collection={collection} handleCardModification={handleCardModification} toggleVisibility={()=> setShowContextMenu(!showContextMenu)} handleCollectionDeletion={handleCollectionDeletion}/> }

                <h5> {content} </h5>
                {
                    collection && collection.flashcards.length > 0 &&
                    <div className={styles.preview} style={{zIndex: -1}} />
                }
            </div>
            :  <div><h5> {content} </h5> </div>
        }
        <div className={styles.rear}> </div>
        </div>
    )
}