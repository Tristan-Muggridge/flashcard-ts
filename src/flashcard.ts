export interface IFlashcard {
	id: string;
	prompt: string;
	answer: string;
	streak: number;
	correctQty: number;
	incorrectQty: number;
	lastReview: Date;
	nextReview: Date;

	toJson?():IFlashcard
}

export interface IFlashcards {
	[key: string] : Flashcard
}

class Flashcard implements IFlashcard{
	id: string;
	prompt: string;
	answer: string;
	streak: number;
	correctQty: number;
	incorrectQty: number;
	lastReview: Date;
	nextReview: Date;

	static reviewDates = (card: Flashcard, lastReview: Date, nextReview: Date) => {
		card.lastReview = lastReview;
		card.nextReview = nextReview;
	}

	static answeredCorrectly = (card: Flashcard):void => {
		const now = new Date();
		const nextReview = new Date(now);
		nextReview.setHours( nextReview.getHours() + Flashcard.hoursInterval );

		card.lastReview = now;
		card.nextReview = nextReview;

		card.correctQty++;
		card.streak++;
	}

	static answeredIncorrectly = (card: Flashcard):void => {
		const now = new Date();
		const nextReview = new Date(now);
		nextReview.setSeconds( nextReview.getSeconds() - 10 )

		card.lastReview = now;
		card.nextReview = nextReview;
		card.incorrectQty++;
		card.streak = 0;
	}

	static hoursInterval = 1;

	constructor(prompt: string, answer: string, id?:string, streak?: number, correctQty?: number, incorrectQty?: number, lastReview?: Date, nextReview?: Date) {
        this.id = id ?? crypto.randomUUID()
		this.prompt= prompt;
		this.answer= answer;
		this.streak= streak || 0;
		this.correctQty= correctQty || 0;
		this.incorrectQty= incorrectQty || 0;
		this.lastReview= lastReview || new Date();
		this.nextReview= nextReview || new Date();
	}

	static toJson = (card: Flashcard) => {
		const output: IFlashcard = {
			id: card.id,
			prompt: card.prompt,
			answer: card.answer,
			streak: card.streak,
			correctQty: card.correctQty,
			incorrectQty: card.incorrectQty,
			lastReview: card.lastReview,
			nextReview: card.nextReview
		}
		return output;
	}

    static fromJson = (obj: Flashcard, id?:string) => new Flashcard(
        obj.prompt,
        obj.answer,
		id ?? crypto.randomUUID(),
        obj.streak,
        obj.correctQty,
        obj.incorrectQty,
        obj.lastReview,
		obj.nextReview
    )

	static FirestoreConverter = {
		toFirestore: (card: Flashcard) => {
			return Flashcard.toJson(card);
		},
		fromFirestore: (snapshot: any, options: any):Flashcard => {
			const data = snapshot.data(options)
			return Flashcard.fromJson(data, snapshot.id);
		}
	}
}

export default Flashcard;