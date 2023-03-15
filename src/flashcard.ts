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
        this.id = id || `${prompt}-${answer}`
		this.prompt= prompt;
		this.answer= answer;
		this.streak= streak || 0;
		this.correctQty= correctQty || 0;
		this.incorrectQty= incorrectQty || 0;
		this.lastReview= lastReview || new Date();
		this.nextReview= nextReview || new Date();
	}

	toJson = () => {
		const output: IFlashcard = {
			id: this.id,
			prompt: this.prompt,
			answer: this.answer,
			streak: this.streak,
			correctQty: this.correctQty,
			incorrectQty: this.incorrectQty,
			lastReview: this.lastReview,
			nextReview: this.nextReview
		}
		return output;
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


    static fromJson = (obj: IFlashcard, id?:string) => new Flashcard(
        obj.prompt,
        obj.answer,
		id ?? `${obj.prompt}-${obj.answer}`,
        obj.streak,
        obj.correctQty,
        obj.incorrectQty,
        obj.lastReview,
		obj.nextReview
    )

	static FirestoreConverter = {
		toFirestore: (card: Flashcard) => {
			return card.toJson();
		},
		fromFirestore: (snapshot: any, options: any) => {
			const data = snapshot.data(options)
			return Flashcard.fromJson(data, snapshot.id);
		}
	}
}

export default Flashcard;