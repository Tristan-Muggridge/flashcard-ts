import { useState, useEffect, useContext } from "react";
import Flashcard from "./flashcard";
import DataContext from "./context/DataContext";


export default function () {

    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const dataContext = useContext(DataContext);

    useEffect( () => {
        dataContext?.getAllFlashcards().then(data => setFlashcards(data))
    }, [])

    return (
        <li>
        {
            flashcards.map(data => <li> {data.prompt} </li>)
        }
        </li>
    )

}