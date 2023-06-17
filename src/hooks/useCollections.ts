import DataContext, { ICollections, LocalData } from "../context/DataContext";
import { useState, useEffect, useContext } from "react";

export default function useCollections(userId: string) {

    const dataContext = useContext(DataContext) ?? LocalData;
    const [collections, setCollections] = useState<ICollections>()

    useEffect( () => {
        const retrieveCollections = async () => {
            const c = await dataContext?.loadCollections(userId) as ICollections
            setCollections({...c})
        }

        retrieveCollections();
    }, [dataContext])

    return {collections, setCollections};
}