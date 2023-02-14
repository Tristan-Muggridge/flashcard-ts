export interface IFlashcard {
	prompt: string;
	answer: string;
	streak: number;
	correctQty: number;
	incorrectQty: number;
	lastReview: Date;

	toJson?():IFlashcard
}

class Flashcard implements IFlashcard{
	prompt: string;
	answer: string;
	streak: number;
	correctQty: number;
	incorrectQty: number;
	lastReview: Date;
	
	constructor(prompt: string, answer: string, streak?: number, correctQty?: number, incorrectQty?: number, lastReview?: Date) {
        this.prompt= prompt;
		this.answer= answer;
		this.streak= streak || 0;
		this.correctQty= correctQty || 0;
		this.incorrectQty= incorrectQty || 0;
		this.lastReview= lastReview || new Date();
	}

	toJson = () => {
		const output: IFlashcard = {
			prompt: this.prompt,
			answer: this.answer,
			streak: this.streak,
			correctQty: this.correctQty,
			incorrectQty: this.incorrectQty,
			lastReview: this.lastReview
		}
		return output;
	}

    static fromJson = (obj: IFlashcard) => new Flashcard(
        obj.prompt,
        obj.answer,
        obj.streak,
        obj.correctQty,
        obj.incorrectQty,
        obj.lastReview
    )

	static FirestoreConverter = {
		toFirestore: (card: Flashcard) => {
			return {
				prompt: card.prompt,
				answer: card.answer,
				streak: card.streak,
				correctQty: card.correctQty,
				incorrectQty: card.incorrectQty,
				lastReview: card.lastReview
			};
		},
		fromFirestore: (snapshot: any, options: any) => {
			const data = snapshot.data(options)
			return new Flashcard(data.prompt, data.answer, data.streak, data.correctQty, data.incorrectQty, data.lastReview);
		}
	}
}

export default Flashcard;