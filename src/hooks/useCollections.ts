import DataContext, { ICollections } from "../context/DataContext";
import { useState, useEffect, useContext } from "react";

export default function useCollections(userId: string) {

    const dataContext = useContext(DataContext);

    const [collections, setCollections] = useState<ICollections>()

    useEffect( () => {
        const retrieveCollections = async () => {
            const c = await dataContext?.loadCollections(userId) as ICollections
            setCollections({...c})
        }

        retrieveCollections();
    }, [])

    return {collections, setCollections};
}