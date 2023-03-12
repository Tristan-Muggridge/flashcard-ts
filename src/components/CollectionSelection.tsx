import Flashcard, { IFlashcard } from "../flashcard";
import DataContext, {ICollections} from "../context/DataContext";
import { useState, useContext, useEffect } from "react";
import Collection from "./Collection";
import collection, { ICollection } from "../collection";
import CardTable from './CardTable';

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
        const created = new collection("Created Collection", [])
        const updatedCollection = collections as ICollections;
        updatedCollection[created.id] = created;
        setCollections({...updatedCollection});
    }

    const handleCollectionModification = (collection: ICollection) => {
        if (!collections) return;
        
        const updatedCollection = collections;
        updatedCollection[collection.id].name = collection.name;
        setCollections( {...updatedCollection} )
    }

    const handleDeleteCollection = (id: string) => {
        if (!collections || !activeCollection) return;
        
        if (Object.keys(collections).length > 1) {
            if (id == activeCollection.id) setActiveCollection( {id: "", name: "", flashcards: []} );
            const newCollections = collections;
            delete newCollections[id]
            setCollections( {...newCollections} )    
        } else setCollections({});

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
                        handleCollectionModification={handleCollectionModification}
                        active={activeCollection?.id == key}
                        key={collections[key].id}
                    />
                : ''
                )
            }

            <Collection 
                content={`New Collection +`} 
                handleClick={()=>handleCreateCollection()} 
                handleCardModification={handleCardModification} 
                handleCollectionDeletion={handleDeleteCollection} 
                handleCollectionModification={handleCollectionModification}
                active={false}
            />
        </div >
        
        <div>
        { 
            collections && activeCollection && activeCollection.id && 
            <CardTable 
                flashcards={activeCollection?.flashcards as Flashcard[]} 
                handleCardModification={handleCardModification}
            />
        }
        </div>
    </section>
}