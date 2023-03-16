import React from "react";
import { db } from "../util/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; 
import Flashcard, {IFlashcard} from "../flashcard";
import Collection, { ICollection } from "../collection";

export interface IDataContext {
    createCard(collection: ICollection, card: Flashcard):Promise<Flashcard>;
    getAllFlashcards():Promise<Flashcard[]>;
	deleteCard(card: Flashcard):void;
	updateCard(card: IFlashcard, index?:number):void;

	loadCollections(): ICollections
	saveCollections(Collections: ICollections):void
	saveCollection(Collection: ICollection):void
}

export interface ICollections {
	[id: string]: Collection
}

export const FirebaseData: IDataContext = {
	createCard: function (collection: ICollection, card: Flashcard): Promise<Flashcard> {
		throw new Error("Function not implemented.");
	},
	getAllFlashcards: function (): Promise<Flashcard[]> {
		throw new Error("Function not implemented.");
	},
	deleteCard: function (card: Flashcard): void {
		throw new Error("Function not implemented.");
	},
	updateCard: function (card: IFlashcard, index?: number | undefined): void {
		throw new Error("Function not implemented.");
	},
	loadCollections: function (): ICollections {
		throw new Error("Function not implemented.");
	},
	saveCollections: function (Collections: ICollections): void {
		throw new Error("Function not implemented.");
	},
	saveCollection: function (Collection: ICollection): void {
		throw new Error("Function not implemented.");
	}
}

export const LocalData: IDataContext = {
	saveCollections: (collections: ICollections) => {
		if (!collections) return;
		localStorage.setItem("collection-test", JSON.stringify(collections))
	},

	loadCollections: () => {
		const localCollections = localStorage.getItem("collection-test");
		if (!localCollections) return {};

		const output: ICollections = {}
		const JSONCollection: ICollections = JSON.parse(localCollections);
		for (const collection in JSONCollection) {
			const converted: Collection = Collection.fromJson(JSONCollection[collection])
			if (converted) output[converted.id] = converted ; 
		}

		return output;
	},

	saveCollection: async (collection: Collection) => {
		const collections = await LocalData.loadCollections();
		collections[collection.id] = collection;
		LocalData.saveCollections(collections);
	},

	createCard: async (collection: ICollection, card: Flashcard) => new Promise(resolve => {
		let tmp = LocalData.loadCollections()
		tmp[collection.id].flashcards.push(card)
		localStorage.setItem('collection-test', JSON.stringify(tmp));
		resolve(card);
	}),
    
	getAllFlashcards: async () => new Promise(resolve => {
		console.debug("localData: Read")
		resolve(JSON.parse(localStorage.getItem('flashcards') || "[]").map( (e:IFlashcard) => Flashcard.fromJson(e)))
	}),

	deleteCard: (card: Flashcard) => {
		console.debug("localData: Delete")
		console.debug(card.id)
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