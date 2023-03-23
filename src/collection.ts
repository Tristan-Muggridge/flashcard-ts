import Flashcard, { IFlashcard } from "./flashcard"

export interface ICollection {
    id: string
    name: string
    flashcards: Flashcard[]

}

export default class Collection implements ICollection {
    id: string
    name: string
    flashcards: Flashcard[]

    constructor(name: string, flashcards: Flashcard[], id?:string) {
        this.id = id ?? crypto.randomUUID()
        this.name = name;
        this.flashcards = flashcards;
    }

    static fromJson = (obj: Collection, id?:string) => {
        return new Collection(
            obj.name,
            obj.flashcards.map( c => Flashcard.fromJson(c) ),
            obj.id ?? crypto.randomUUID()    
        )
    }

    static toJson = (obj: Collection) => {
        const output = {
            id: obj.id,
            name: obj.name,
            flashcards: obj.flashcards.map(card => Flashcard.toJson(card))
        }
		return output;
    }

    static FirestoreConverter = {
		toFirestore: (collection: Collection) => {
			return Collection.toJson(collection);
		},
		fromFirestore: (snapshot: any, options: any) => {
			const data = snapshot.data(options)
			return Collection.fromJson(data, snapshot.id);
		}
	}

}