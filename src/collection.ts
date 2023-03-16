import Flashcard, { IFlashcard } from "./flashcard"

export interface ICollection {
    id: string
    name: string
    flashcards: Flashcard[]

    toJson?():ICollection
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

    static fromJson = (obj: ICollection, id?:string) => {
        return new Collection(
            obj.name,
            obj.flashcards.map( c => Flashcard.fromJson(c) ),
            obj.id ?? crypto.randomUUID()    
        )
    }

    toJson = () => {
        const output: ICollection = {
            id: this.id,
            name: this.name,
            flashcards: this.flashcards
        }
		return output;
    }

    static FirestoreConverter = {
		toFirestore: (collection: Collection) => {
			return collection.toJson();
		},
		fromFirestore: (snapshot: any, options: any) => {
			const data = snapshot.data(options)
			return Collection.fromJson(data, snapshot.id);
		}
	}

}