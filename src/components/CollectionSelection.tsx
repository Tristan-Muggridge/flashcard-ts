import DataContext, {ICollections} from "../context/DataContext";
import { useState, useContext, useEffect } from "react";
import Collection, { CollectionPlaceHolder } from "./Collection";
import collection, { ICollection } from "../collection";

interface IProps {
    setCollections(collection: ICollections):void
    setActiveCollection(collection: ICollection):void
}

export default function CollectionSelection ({setActiveCollection, setCollections}: IProps) {
    
    const dataContext = useContext(DataContext);
    const [scopedCollections, setScopedCollections] = useState(useContext(DataContext)?.loadCollections());
    
    const handleSelectionClick = (c: ICollection) => setActiveCollection({...c})
    
    const handleCreateCollection = () => {
        const created = new collection("Created Collection", [])
        const updatedCollection = scopedCollections as ICollections;
        updatedCollection[created.id] = created;
        setCollections({...updatedCollection});
    }

    const handleCollectionModification = (collection: ICollection) => {
        if (!scopedCollections) return;
        const updatedCollection = scopedCollections;
        updatedCollection[collection.id].name = collection.name;
        setCollections( {...updatedCollection} )
    }

    const handleDeleteCollection = (id: string) => {
        if (!scopedCollections) return;
        
        if (Object.keys(scopedCollections).length > 1) {
            const newCollections = scopedCollections;
            delete newCollections[id]
            setCollections( {...newCollections} )    
        } 
        else setCollections({});
    }

    const handleCardImport = (collection: ICollection) => {
        const updated = scopedCollections ?? {};
        updated[collection.id].flashcards = collection.flashcards;
        setCollections({...updated})
    }

    useEffect( () => {
        dataContext?.saveCollections(scopedCollections ?? {});
        setCollections(scopedCollections ?? {});
    }, [scopedCollections])

    return (
    <>
    {   scopedCollections && 
        Object.keys(scopedCollections).map(key => <>
            <Collection 
                key={scopedCollections[key].id}
                content={ `${scopedCollections[key]?.name} (${scopedCollections[key]?.flashcards.length})` } 
                collection={scopedCollections[key] as ICollection} 
                
                handleClick={handleSelectionClick}
                handleCardImport={handleCardImport}
                handleCollectionDeletion={handleDeleteCollection}
                handleCollectionModification={handleCollectionModification}
            />
        </>)
    }
        <CollectionPlaceHolder
            handleClick={handleCreateCollection} 
        />
    </>
    )
}