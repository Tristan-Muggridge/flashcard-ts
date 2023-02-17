import Flashcard, { IFlashcard } from "./flashcard"

export interface ICollection {
    id?: string
    name: string
    flashcards: IFlashcard[]
}

export default class Collection implements ICollection {
    id: string
    name: string
    flashcards: IFlashcard[]

    constructor(name: string, flashcards: IFlashcard[], id?:string) {
        this.id = id ?? crypto.randomUUID()
        this.name = name;
        this.flashcards = flashcards;
    }

    static fromJson = (obj: ICollection) => {
        return new Collection(
            obj.name,
            obj.flashcards.map( c => Flashcard.fromJson(c) ),
            obj.id ?? crypto.randomUUID()    
        )
    }
}