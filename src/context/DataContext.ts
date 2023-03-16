import React from "react";
import { db } from "../util/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; 
import Flashcard, {IFlashcard} from "../flashcard";
import Collection, { ICollection } from "../collection";

export interface IDataContext {
	loadCollections(userId: string): Promise<ICollections>
	saveCollections(Collections: ICollections, userId: string):void
}

export interface ICollections {
	[id: string]: Collection
}

const ICollectionsConverter = {
	toFirestore: (collections: ICollections) => {
		const output:any = {};

		Object.keys(collections).forEach(collection => {
			output[collection] = Collection.toJson(collections[collection])
		});

		return output;
	},
	fromFirestore: (snapshot: any, options: any) => {
		const data = snapshot.data(options);
		return data
	}
}

export const FirebaseData: IDataContext = {
	loadCollections: async (userId: string): Promise<ICollections> => {
		const ref = doc(db, userId, "collections").withConverter(ICollectionsConverter);
		const docSnap = await getDoc(ref);
		
		return docSnap.data()
	},
	
	saveCollections: (collections: ICollections, userId: string) => {
		const sendToFirebase = async () => {
			const ref = doc(db, userId, "collections").withConverter(ICollectionsConverter);
			await setDoc(ref, collections);
		} 

		sendToFirebase();
	}
}

export const LocalData: IDataContext = {
	loadCollections: (userId: string) => new Promise(resolve => {
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

	saveCollections: (collections: ICollections, userId: string) => {
		if (!collections) return;
		localStorage.setItem("collection-test", JSON.stringify(collections))
	}
}

export default React.createContext<IDataContext | null>(FirebaseData)