import React from "react";
import { db } from "../util/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; 
import Flashcard, {IFlashcard} from "../flashcard";



export interface IDataContext {
    create(card: Flashcard):Promise<Flashcard>;
    getAllFlashcards():Promise<Flashcard[]>;
	deleteCard(card: Flashcard):void;
	updateCard(card: IFlashcard, index?:number):void;
}

export const FirebaseData: IDataContext = {	
	create: async (card: Flashcard) => {
		const createFlashCard = async () => {
			console.debug("db: Create")

			// const collectionRef = collection(db, `flashcard/${card.prompt}-${card.answer}`);
			const collectionRef = collection(db, "flashcards");
			const docId = (await addDoc(collectionRef, card.toJson())).withConverter(Flashcard.FirestoreConverter).id
			const docRef = doc(db, "flashcards", docId).withConverter(Flashcard.FirestoreConverter)
			const docSnap = await (await getDoc(docRef)).data();
			return docSnap as Flashcard;
		}

		return createFlashCard();
	},
    
	getAllFlashcards: async () => {
		console.debug("db: Read")

        const fetchFlashcards = async () => {
            const flashcards = await getDocs(collection(db, 'flashcards').withConverter(Flashcard.FirestoreConverter));
            return flashcards.docs.map(doc => doc.data())
        }
        return fetchFlashcards();
    },

	deleteCard: async (card: IFlashcard) => {
		console.debug("firebase: Delete")
		console.debug(card)
		await deleteDoc(doc(db, "flashcards", card.id));
	},

	updateCard: async (card: Flashcard) => {
		console.debug("firebase: Update")
		await setDoc(doc(db, "flashcards", card.id), card.toJson());
	},
}

export const LocalData: IDataContext = {
    create: async (card: Flashcard) => new Promise(resolve => {
		console.debug("localData: Create")
		const currentCards: Flashcard[] = JSON.parse(localStorage.getItem('flashcards') || "[]").map( (e:IFlashcard) => Flashcard.fromJson(e));
		const updatedCards = [card, ...currentCards];
		localStorage.setItem('flashcards', JSON.stringify(updatedCards));
		resolve(card);
	}),
    
	getAllFlashcards: async () => new Promise(resolve => {
		console.debug("localData: Read")
		resolve(JSON.parse(localStorage.getItem('flashcards') || "[]").map( (e:IFlashcard) => Flashcard.fromJson(e)))
	}),

	deleteCard: (card: Flashcard) => {
		console.debug("localData: Delete")
		const cards: Flashcard[] = JSON.parse(localStorage.getItem('flashcards') || "[]");
		localStorage.setItem('flashcards', JSON.stringify(cards.filter(e => e.id != card.id)));
	},

	updateCard: (card: Flashcard, index: number) => {
		console.debug("LocalData: Update")
		const cards: Flashcard[] = JSON.parse(localStorage.getItem('flashcards') || "[]");
		cards[index] = card
		localStorage.setItem('flashcards', JSON.stringify(cards));
	}
}

export default React.createContext<IDataContext | null>(FirebaseData)