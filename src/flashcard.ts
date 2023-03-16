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

	reviewDates = (lastReview: Date, nextReview: Date) => {
		this.lastReview = lastReview;
		this.nextReview = nextReview;
	}

	answeredCorrectly = () => {
		const now = new Date();
		const nextReview = now;
		nextReview.setHours( nextReview.getHours() + Flashcard.hoursInterval );
		nextReview.setSeconds( nextReview.getSeconds() - 10 )

		this.reviewDates(now, nextReview);
		this.correctQty++;
		this.streak++;

		console.debug(this.nextReview)
	}

	answeredIncorrectly = () => {
		const now = new Date();
		const nextReview = now;
		nextReview.setSeconds( nextReview.getSeconds() - 10 )

		this.reviewDates(now, nextReview);
		this.incorrectQty++;
		this.streak = 0;
	}

	static toJson = (card: IFlashcard) => {
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

    static fromJson = (obj: IFlashcard, id?:string) => new Flashcard(
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
		fromFirestore: (snapshot: any, options: any) => {
			const data = snapshot.data(options)
			return Flashcard.fromJson(data, snapshot.id);
		}
	}
}

export default Flashcard;