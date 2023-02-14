import { useEffect, useState } from 'react'
import { collection, doc, addDoc, setDoc, getDoc} from "firebase/firestore"; 
import { db } from './util/firebase';

import Flashcard from './flashcard';
import './App.css'

const collectionRef = collection(db, "flashcard")

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
	const getFlashCards = async () => {
		const docRef = doc(db, "flashcard/flashcard").withConverter(Flashcard.FirestoreConverter);
		
		await setDoc( docRef, new Flashcard("convertedPrompt", "convertedAnswer"))
		
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
		}
	} 

	// const addFlashCard = async () => {
	// 	const docRef = await addDoc(collectionRef, new Flashcard("addedPrompt", "addedAnswer").toJson())
	// 	console.debug(docRef);
	// }

	// addFlashCard();

	// getFlashCards();
  }, [])

  return (
    <div className="App">
      	<div>
        
    	</div>
    </div>
  )
}

export default App
