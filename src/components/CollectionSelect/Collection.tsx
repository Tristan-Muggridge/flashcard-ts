import { useEffect, useMemo, useRef, useState } from 'react';
import {BsThreeDots, BsPlusLg, BsPencilFill} from 'react-icons/bs'
import { ICollection } from '../../collection';
import styles from '../../styles/Collection.module.css'
import Flashcard from '../../flashcard';
import EditModal from '../EditModal';

interface IProps {
    collection: ICollection, 
    setEditing(editing: boolean):void
    handleCardImport(collection: ICollection):void, 
    toggleVisibility(): any,
    handleCollectionDeletion(id: any):any
    handleCollectionModification(collection: ICollection):void, 
}

const ContextMenu = ({collection, setEditing, handleCardImport, toggleVisibility, handleCollectionDeletion}: IProps) => {
    
    const importButtonRef = useRef<HTMLInputElement | null>(null)

    const handleCSVImport = async (e: any) => {
        e.stopPropagation();
        const reader = () => {
            const output = new FileReader()
            output.onload = async(e: any) => {
                    const text = (e.target.result) 
        
                    const splitText = text.split(",");
                    const cards: Flashcard[] = [];
        
                    let rows = 0;
        
                    while (splitText.length > 1) {
                        let [id, prompt, answer, streak, correctQty, incorrectQty, lastReview] = splitText.splice(0, 7);
                        id = id.replace('\n', "").replace('\r', "");
                        let matches = collection.flashcards.filter(card => card.id == id.replace('\n', "").replace('\r', "")).length
                        if (rows > 0 && !matches) cards.push( new Flashcard(prompt, answer, id.split('\r\n')[1], streak, correctQty, incorrectQty, new Date(lastReview)) )
                        rows++;
                    }
                    
                    const updatedCollection = collection;
                    updatedCollection.flashcards = [...collection.flashcards, ...cards] 
                    handleCardImport( updatedCollection );
                }
            return output;
        };

        const files = e.target.files;
        Object.keys(files).forEach(async (file: any) => await reader().readAsText(files[file]));
        
        toggleVisibility();
    }

    const handleCSVExport = (e:any) => {
        e.stopPropagation();
        const cards = collection.flashcards.map(card => 
            `${card.id},${card.prompt},${card.answer},${card.streak},${card.correctQty},${card.incorrectQty},${card.lastReview},`
        ).join("\n")

        const csvContent = `data:text/csv;charset=utf-8,\nid,prompt,answer,streak,correctQty,incorrectQty,lastReview,\n${cards}`
        const encoded = encodeURI(csvContent)

        const link = document.createElement('a');
        link.setAttribute('href', encoded);
        link.setAttribute('download', `${collection.name}.csv`);
        link.setAttribute('style', 'display: none;')
        document.body.appendChild(link);

        link.click();
        toggleVisibility();
    }

    const handleEditOnClick = (e:any) => {
        e.stopPropagation();
        setEditing(true); 
        toggleVisibility();
    }

    const handleDelete = (e:any) => {
        e.stopPropagation();
        handleCollectionDeletion(collection.id); 
        toggleVisibility();
    }

    const handleImportClick = (e:any) => {
        e.stopPropagation();
        importButtonRef.current?.click()
    }

    return (
        <div className={styles.contextMenu}>
            <ul>
                <li onClick={handleEditOnClick}>Edit </li>
                <li onClick={handleDelete}>Delete </li>
                <li onClick={handleCSVExport}>Export CSV </li>
                <li onClick={handleImportClick}> 
                    <input 
                        multiple 
                        ref={importButtonRef} 
                        onChange={handleCSVImport} 
                        style={{display: "none"}} 
                        type="file" 
                        name="csv" 
                        id="" 
                    /> Import CSV 
                </li>
            </ul>
        </div>
    )
}

interface mainProps {
    collection?: ICollection, 
    content: any, 
    handleClick:any, 
    handleCardImport(collection: ICollection):void, 
    handleCollectionDeletion(id:string):void, 
    handleCollectionModification(collection: ICollection):void, 
}

export default function ({collection, content, handleClick, handleCardImport, handleCollectionDeletion, handleCollectionModification}: mainProps) {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [editing, setEditing] = useState(false);
    const due = useMemo(()=>collection?.flashcards.filter(card => new Date(card.nextReview) < new Date()).length, [collection]);

    return (
        <>
            <div className={styles.collection} onClick={()=>handleClick(collection)}>
            {
                collection ? 
                <div onClick={() => handleClick(collection)}>
                    <i className={styles.editIcon} onClick={()=>setShowContextMenu(!showContextMenu)}><BsPencilFill /></i>

                    { showContextMenu && collection && 
                        <ContextMenu 
                            collection={collection} 
                            setEditing={()=> setEditing(true)}
                            handleCardImport={handleCardImport} 
                            toggleVisibility={()=> setShowContextMenu(!showContextMenu)} 
                            handleCollectionDeletion={handleCollectionDeletion}
                            handleCollectionModification={handleCollectionModification}
                        /> 
                    }

                    { due as number > 0 && <div className={styles.dueAlert}> {due} </div>}

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

export function CollectionPlaceHolder({handleClick}: {handleClick():void}) {
    return (
        <div className={styles.collection} onClick={handleClick}>
            <BsPlusLg style={{margin: "auto"}} size={20}/>
            <div className={styles.rear}> </div>
        </div>
    )
}