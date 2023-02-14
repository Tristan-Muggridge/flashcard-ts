import { useEffect, useState } from 'react'
import { collection, doc, addDoc, setDoc, getDoc, Firestore, WriteBatch, writeBatch} from "firebase/firestore"; 
import { db } from './util/firebase';

import Flashcard from './flashcard';
import './App.css'
import DataContext, { FirebaseData, LocalData } from './context/DataContext';
import TestComponent from './TestComponent';

const collectionRef = collection(db, "flashcard")

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {

	// localStorage.setItem('flashcards', JSON.stringify([
	// 	new Flashcard("発展", "development"),
	// 	new Flashcard("散歩", "stroll"),
	// 	new Flashcard("耳", "ear"),
	// 	new Flashcard("舌", "tongue"),
	// 	new Flashcard("ヘソ", "navel"),
	// 	new Flashcard("口", "mouth"),
	// ]))

	// const firebase = FirebaseData.getAllFlashcards().then(data => console.log('firebase', data))
	// const local = LocalData.getAllFlashcards().then(data => console.debug('local', data));

  }, [])

  return (
    <div className="App">
      	<DataContext.Provider value={ LocalData }>
			<h1> From LocalData </h1>
			<TestComponent />
		</DataContext.Provider>
      	<DataContext.Provider value={ FirebaseData }>
			<h1> From Firebase </h1>
			<TestComponent />
		</DataContext.Provider>
    </div>
  )
}

export default App
