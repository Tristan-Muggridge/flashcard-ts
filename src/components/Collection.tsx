import { useEffect, useRef, useState } from 'react';
import {BsThreeDots} from 'react-icons/bs'
import { ICollection } from '../collection';
import styles from '../styles//Collection.module.css'
import Flashcard, { IFlashcard } from '../flashcard';
import EditModal from './EditModal';

interface IProps {
    collection: ICollection, 
    setEditing(editing: boolean):void
    handleCardModification(card: IFlashcard[]):any, 
    toggleVisibility(): any,
    handleCollectionDeletion(id: any):any
    handleCollectionModification(collection: ICollection):void, 
}
const ContextMenu = ({collection, setEditing, handleCardModification, toggleVisibility, handleCollectionDeletion, handleCollectionModification}: IProps) => {
    
    const importButtonRef = useRef<HTMLInputElement | null>(null)

    const handleCSVImport = async (e: any) => {
        const reader = () => {
            const output = new FileReader()
            output.onload = async(e: any) => {
                    const text = (e.target.result) 
        
                    const splitText = text.split(",");
                    const cards: IFlashcard[] = [];
        
                    let rows = 0;
        
                    while (splitText.length > 1) {
                        let [id, prompt, answer, streak, correctQty, incorrectQty, lastReview] = splitText.splice(0, 7);
                        id = id.replace('\n', "").replace('\r', "");
                        let matches = collection.flashcards.filter(card => card.id == id.replace('\n', "").replace('\r', "")).length
                        if (rows > 0 && !matches) cards.push( new Flashcard(prompt, answer, id.split('\r\n')[1], streak, correctQty, incorrectQty, new Date(lastReview)) )
                        rows++;
                    }
        
                    handleCardModification( [...collection.flashcards, ...cards] )
                }
            return output;
        };

        const files = e.target.files;
        Object.keys(files).forEach(async (file: any) => { await reader().readAsText(files[file]); console.debug(files[file])})
        
        toggleVisibility();
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
                <li onClick={()=> { setEditing(true); toggleVisibility(); } }>Edit</li>
                <li onClick={()=> { handleCollectionDeletion(collection.id); toggleVisibility(); }}>Delete</li>
                <li onClick={handleCSVExport}>Export CSV</li>
                <li onClick={()=> importButtonRef.current?.click()}> <input multiple ref={importButtonRef} onChange={handleCSVImport} style={{display: "none"}} type="file" name="csv" id="" /> Import CSV </li>
            </ul>
        </div>
    )
}

interface mainProps {
    collection?: ICollection, 
    content: any, 
    handleClick:any, 
    handleCardModification(card: IFlashcard[]):any, 
    handleCollectionDeletion(id:any):void, 
    handleCollectionModification(collection: ICollection):void, 
    active:boolean
}

export default function ({collection, content, handleClick, handleCardModification, handleCollectionDeletion, handleCollectionModification, active}: mainProps) {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [editing, setEditing] = useState(false);

    return (
        <>
        <div className={`${styles.collection} ${active ? styles.active : ''}`} onClick={()=>handleClick(collection)}>
        {
            collection ? 
            <div onClick={() => handleClick()}>
                <button className={styles.elipses} onFocus={()=>setShowContextMenu(true)}> <i><BsThreeDots /></i> </button>
                { 
                showContextMenu && 
                    <ContextMenu 
                        collection={collection} 
                        setEditing={()=> {setEditing(true); console.debug(editing)}}
                        handleCardModification={handleCardModification} 
                        toggleVisibility={()=> setShowContextMenu(!showContextMenu)} 
                        handleCollectionDeletion={handleCollectionDeletion}
                        handleCollectionModification={handleCollectionModification}
                    /> 
                }

                <h5> {content} </h5>
                {
                    collection && collection.flashcards.length > 0 &&
                    <div className={styles.preview} style={{zIndex: -1}} />
                }
                
            </div>
            :  <div><h5> {content} </h5></div>
        }
            <div className={styles.rear}> </div>
        </div>

        {collection && editing && <EditModal initialObject={JSON.parse(JSON.stringify(collection))} handleSubmit={(e: ICollection)=> handleCollectionModification(e)} openState={()=>setEditing(false)}/>}
        </>
    )
}