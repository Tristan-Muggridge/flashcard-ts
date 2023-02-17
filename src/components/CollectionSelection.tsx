import Flashcard, { IFlashcard } from "../flashcard";
import DataContext from "../context/DataContext";
import { useState, useContext } from "react";
import Collection from "./Collection";
import collection, { ICollection } from "../collection";

import styles from '../styles/CardTable.module.css'

export default function CollectionSelection () {

    const dataContext = useContext(DataContext)

	const [collections, setCollections] = useState<Map<string, ICollection>>(new Map([
        ["1", new collection("Collection 1", [new Flashcard("心", "heart"), new Flashcard("散歩", "stroll")])],
        ["2", new collection("War Words List", [new Flashcard("飢饉", "famine")])],
        ["3", new collection("Face List", [new Flashcard("笑顔", "smile")])],
    ]));

    return <>
        {
            Array.from(collections.keys()).map(key => collections.get(key) 
                ? <Collection content={ `${collections.get(key)?.name} (${collections.get(key)?.flashcards.length})` } collection={collections.get(key) as ICollection}/> 
                : ''
            )
        }
        <Collection content={`New Collection +`} handleClick={() => console.debug("creating a new collection")}/>
    </>
}