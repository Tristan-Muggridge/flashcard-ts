import DataContext, {ICollections} from "../../context/DataContext";
import { useState, useContext, useEffect } from "react";
import Collection, { CollectionPlaceHolder } from "./Collection";
import collection, { ICollection } from "../../collection";
import { User } from "firebase/auth";

enum StorageMode  {
	"Local" = "Local",
	"Cloud" = "Cloud"
}

interface IProps {
    userId: string
    activeCollection: ICollection
    setActiveCollection(collection: ICollection):void
    setActive(b: boolean):void
    storageMode: StorageMode
}

export default function CollectionSelection ({userId, activeCollection, setActiveCollection, setActive, storageMode}: IProps) {
    
    const dataContext = useContext(DataContext);
    const [collections, setCollections] = useState<ICollections>()
    
    useEffect( () => {
        
        const retrieveCollections = async () => {
            const c = await dataContext?.loadCollections(userId) as ICollections
            setCollections(c)
        }

        retrieveCollections();
    }, [])

    const handleSelectionClick = (c: ICollection) => {setActiveCollection({...c}); setActive(true)}
    
    const handleCreateCollection = () => {
        const created = new collection("Created Collection", [])
        const updatedCollection = collections as ICollections ?? {};
        updatedCollection[created.id] = created;
        setCollections({...updatedCollection});
    }

    const handleCollectionModification = (collection: ICollection) => {
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
        }

        else {setCollections({}); setActive(false)}
    }

    const handleCardImport = (collection: ICollection) => {
        const updated = collections ?? {};
        updated[collection.id].flashcards = collection.flashcards;
        setCollections({...updated})
        setActiveCollection({...updated[collection.id]})
    }

    useEffect( () => {
        if (!collections || Object.keys(collections).length == 0) return;
        if (collections) dataContext?.saveCollections(collections, userId);
        setCollections(collections);
    }, [collections])

    useEffect( () => {
        if (!activeCollection) return;
        const updated = collections ?? {};
        updated[activeCollection.id] = activeCollection as collection
        setCollections({...updated});
    }, [activeCollection])

    useEffect( () => {
        const retrieveCollections = async () => {
            const c = await dataContext?.loadCollections(userId) as ICollections
            setCollections(c)
        }

        retrieveCollections();
    }, [storageMode])

    return (
    <>
    {   collections && 
        Object.keys(collections).map(key => <>
            <Collection 
                key={collections[key].id}
                content={ `
                    ${activeCollection && collections[key].id == activeCollection.id ? activeCollection.name : collections[key]?.name }
                    (${activeCollection && collections[key].id == activeCollection.id ? activeCollection.flashcards.length : collections[key]?.flashcards.length })
                ` } 
                collection={collections[key] as ICollection} 
                handleClick={handleSelectionClick}
                handleCardImport={handleCardImport}
                handleCollectionDeletion={handleDeleteCollection}
                handleCollectionModification={handleCollectionModification}
            />
        </>)
    }
        <CollectionPlaceHolder
            key={"placeholder"}
            handleClick={handleCreateCollection} 
        />
    </>
    )
}