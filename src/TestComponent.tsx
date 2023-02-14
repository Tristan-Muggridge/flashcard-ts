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
        <table>
            <thead>
                <tr>
                    <th>Prompt</th>
                    <th>Answer</th>
                </tr>
            </thead>
            <tbody>
                {
                    flashcards.map(data => data.prompt && data.answer && <tr> 
                        <td>{data.prompt}</td>
                        <td>{data.answer}</td> 
                    </tr>)
                }
            </tbody>
        
        </table>
    )

}