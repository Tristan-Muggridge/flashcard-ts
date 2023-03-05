import Flashcard, { IFlashcard } from "../flashcard";
import DataContext from "../context/DataContext";
import { useState, useContext, useEffect } from "react";
import Collection from "./Collection";
import collection, { ICollection } from "../collection";
import CardTable from './CardTable';

import styles from '../styles/CardTable.module.css'

export default function CollectionSelection () {
    const dataContext = useContext(DataContext);

    const [collections, setCollections] = useState(useContext(DataContext)?.loadCollections());
    const [activeCollection, setActiveCollection] = useState<ICollection>();
    
    const handleSelectionClick = (c: ICollection) => setActiveCollection(c)
    const handleCardModification = (cards: IFlashcard[]) => {
        if (activeCollection?.flashcards) activeCollection.flashcards = cards;
        setCollections( {...collections} )
    }
    const handleCreateCollection = () => {
        const newCollection = new collection("Created Collection", [])
        setCollections({...collections, newCollection})
        console.debug("created a collection")
    }
    const handleDeleteCollection = (id: string) => {
        if (!collections || !activeCollection) return;
        let newCollections = collections
        delete collections[id]
        setCollections( {...newCollections} )
    }

    useEffect( () => {
        if (!collections) return;
        dataContext?.saveCollections(collections);
    }, [collections])

    return <section style={{ display: "flex", alignItems: 'center', justifyContent: 'space-around', gap: "4rem"}}>
    
        <div style={{padding: "2rem 5rem", display: "flex", flexWrap: "wrap", gap: "1rem"}}>
            {   collections && 
                Object.keys(collections).map(key => collections[key] 
                ?
                    <Collection 
                        content={ `${collections[key]?.name} (${collections[key]?.flashcards.length})` } 
                        collection={collections[key] as ICollection} 
                        handleClick={handleSelectionClick}
                        handleCardModification={handleCardModification}
                        handleCollectionDeletion={handleDeleteCollection}
                        active={activeCollection?.id == key}
                    />
                : ''
                )
            }
            <Collection content={`New Collection +`} handleClick={()=>handleCreateCollection()} handleCardModification={handleCardModification} handleCollectionDeletion={handleDeleteCollection} active={false}/>
        </div >
        
        <div>
        { 
            activeCollection && 
            <CardTable 
                flashcards={activeCollection?.flashcards as Flashcard[]} 
                handleCardModification={handleCardModification}
            />
        }
        </div>
    </section>
}