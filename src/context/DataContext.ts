import React from "react";
import { db } from "../util/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; 
import Flashcard, {IFlashcard} from "../flashcard";
import Collection, { ICollection } from "../collection";

export interface IDataContext {
	loadCollections(): Promise<ICollections>
	saveCollections(Collections: ICollections):void
}

export interface ICollections {
	[id: string]: Collection
}

export const FirebaseData: IDataContext = {
	loadCollections: async (): Promise<ICollections> => {
		const docRef = doc(db, "test-user", "collections");
		const docSnap = await getDoc(docRef);

		// console.debug(Collection.fromJson(JSON.parse(docSnap.data()));)
		console.debug(docSnap.data());

		docSnap.data()

		return {}
	},
	
	saveCollections: function (collections: ICollections): void {
		const output: {[key: string] : string} = {}
		Object.keys(collections).forEach(key => {
			if (collections[key]) output[key] = JSON.stringify(collections[key]);
		})

		console.debug(output)

		const sendToFirebase = async () => {
			await setDoc(doc(db, "test-user", "collections"), output);	
		} 

		sendToFirebase();
	}
}

export const LocalData: IDataContext = {
	saveCollections: (collections: ICollections) => {
		if (!collections) return;
		localStorage.setItem("collection-test", JSON.stringify(collections))
	},

	loadCollections: () => new Promise(resolve => {
		const localCollections = localStorage.getItem("collection-test");
		if (!localCollections) return {};

		const output: ICollections = {}
		const JSONCollection: ICollections = JSON.parse(localCollections);
		for (const collection in JSONCollection) {
			const converted: Collection = Collection.fromJson(JSONCollection[collection])
			if (converted) output[converted.id] = converted ; 
		}

		resolve(output);
	}),
}

export default React.createContext<IDataContext | null>(FirebaseData)