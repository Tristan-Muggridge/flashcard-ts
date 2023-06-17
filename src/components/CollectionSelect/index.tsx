import DataContext, {ICollections, IDataContext} from "../../context/DataContext";
import { useState, useContext, useEffect } from "react";
import Collection, { CollectionPlaceHolder } from "./Collection";
import collection from "../../collection";

enum StorageMode  {
	"Local" = "Local",
	"Cloud" = "Cloud"
}

interface IProps {
    userId: string
    handleDeletion(collections: ICollections, dataContext: IDataContext):void
    activeCollection: collection
    setActiveCollection(collection: collection):void
    setActive(b: boolean):void
    collections: ICollections
    setCollections(collections: ICollections):void
    storageMode: StorageMode
}

export default function CollectionSelection ({collections, handleDeletion, userId, activeCollection, setActiveCollection, setActive, storageMode, setCollections}: IProps) {
    
    const dataContext = useContext(DataContext);
    
    console.debug("CollectionSelection: ", collections, activeCollection, storageMode, userId)

    const handleSelectionClick = (c: collection) => {setActiveCollection(c); setActive(true)};
    
    const handleCreateCollection = () => {
        const created = new collection("Created Collection", [])
        setCollections({...collections as ICollections, [created.id]: created});
    }

    const handleCollectionModification = (collection: collection) => {
        if (!collections) return;
        const updatedCollection = collections;
        updatedCollection[collection.id].name = collection.name;
        setCollections( {...updatedCollection} )
        setActiveCollection({...updatedCollection[collection.id]})
    }

    const handleDeleteCollection = (id: string) => {
        if (!collections) return;
        
        if (Object.keys(collections).length > 1) {
            console.debug("deleting single object")
            const newCollections = collections;
            delete newCollections[id]
            setCollections( {...newCollections} )
            if (activeCollection && id == activeCollection.id) {
                setActive(false)
            }
            handleDeletion({...newCollections}, dataContext as IDataContext)
        }

        else {setCollections({}); setActive(false); handleDeletion({}, dataContext as IDataContext)}
    }

    const handleCardImport = (collection: collection) => {
        const updated = collections ?? {};
        updated[collection.id].flashcards = collection.flashcards;
        setCollections({...updated})
        setActiveCollection({...updated[collection.id]})
    }

    useEffect( () => {
        if (!collections || Object.keys(collections).length == 0) return;
        if (collections) dataContext?.saveCollections(collections, userId);
    }, [collections])

    useEffect( () => {
        const retrieveCollections = async () => {
            const c = await dataContext?.loadCollections(userId) as ICollections
            setCollections(c)
        }

        retrieveCollections();
    }, [storageMode, userId])

    return (
    <>
    {   collections && 
        Object.keys(collections).map(key => 
            <Collection 
                key={collections[key].id}
                content={<div style={{display: 'flex', flexDirection: 'column'}}> <p>{collections[key]?.name}</p> <p>({collections[key]?.flashcards.length} Card{collections[key]?.flashcards.length==1?'':'s'})</p> </div>} 
                collection={collections[key] as collection} 
                handleClick={handleSelectionClick}
                handleCardImport={handleCardImport}
                handleCollectionDeletion={handleDeleteCollection}
                handleCollectionModification={handleCollectionModification} />
        )
    }
        <CollectionPlaceHolder
            key={"placeholder"}
            handleClick={handleCreateCollection} />
    </>
    )
}