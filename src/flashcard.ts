interface IFlashcard {
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
	
	constructor(prompt: string, answer: string) {
		this.prompt= prompt;
		this.answer= answer;
		this.streak= 0;
		this.correctQty= 0;
		this.incorrectQty= 0;
		this.lastReview= new Date();
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
			return new Flashcard(data.prompt, data.answer);
		}
	}
}

export default Flashcard;