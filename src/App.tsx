import { useEffect, useState } from 'react'
import { collection, doc, addDoc, setDoc, getDoc} from "firebase/firestore"; 
import { db } from './util/firebase';

import reactLogo from './assets/react.svg'
import './App.css'

class Flashcard {
	
	prompt: string;
	answer: string;
	streak: number;
	correctQty: number;
	incorrectQty: number;
	lastReview: Date;
	
	constructor(prompt: string, answer: string) {
		this.prompt= prompt;
		this.answer= answer;
		this.streak= 0;
		this.correctQty= 0;
		this.incorrectQty= 0;
		this.lastReview= new Date();
	}

	toJson = () => {
		return {
			prompt: this.prompt,
			answer: this.answer,
			streak: this.streak,
			correctQty: this.correctQty,
			incorrectQty: this.incorrectQty,
			lastReview: this.lastReview
		}
	}

	static FirestoreConverter = {
		toFirestore: (card: Flashcard) => {
			return {
				prompt: card.prompt,
				answer: card.answer,
				streak: card.streak,
				correctQty: card.correctQty,
				incorrectQty: card.incorrectQty,
				lastReview: card.lastReview
			};
		},
		fromFirestore: (snapshot: any, options: any) => {
			const data = snapshot.data(options)
			return new Flashcard(data.prompt, data.answer);
		}
	}
}

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

	const addFlashCard = async () => {
		const docRef = await addDoc(collectionRef, new Flashcard("addedPrompt", "addedAnswer").toJson())
		console.debug(docRef);
	}

	addFlashCard();

	// getFlashCards();
  }, [])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
