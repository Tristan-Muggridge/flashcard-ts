import React from "react";
import { db } from "../util/firebase";
import { collection, getDoc, getDocs } from "firebase/firestore"; 
import Flashcard, {IFlashcard} from "../flashcard";


interface IDataContext {
    create():any;
    getAllFlashcards():Promise<Flashcard[]>;
}

export const FirebaseData: IDataContext = {
    create: () => {},
    getAllFlashcards: async () => {
        const fetchFlashcards = async () => {
            const flashcards = await getDocs(collection(db, 'flashcards').withConverter(Flashcard.FirestoreConverter));
            return flashcards.docs.map(doc => doc.data())
        }
        return fetchFlashcards();
    }
}

export const LocalData: IDataContext = {
    create: () => {},
    getAllFlashcards: () => new Promise(resolve => resolve(JSON.parse(localStorage.getItem('flashcards') || "[]").map( (e:IFlashcard) => Flashcard.fromJson(e))))
}

export default React.createContext<IDataContext | null>(FirebaseData)

/*

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
		const docRef = await (await addDoc(collectionRef, new Flashcard("addedPrompt", "addedAnswer").toJson())).withConverter(Flashcard.FirestoreConverter)
		console.debug(docRef.id);
	}


*/