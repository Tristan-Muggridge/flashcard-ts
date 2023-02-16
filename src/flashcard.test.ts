import Flashcard from "./flashcard";
import {describe, expect, it} from 'vitest'

describe("#Flashcard", () => {

    const cardString = `{
        "id":"心-heart",
        "prompt":"心",
        "answer":"heart",
        "streak":0,
        "correctQty":0,
        "incorrectQty":0,
        "lastReview":"2023-02-16T08:54:34.818Z"
    }`

    const cardJSON = JSON.parse(cardString);

    it("Generates a prompt-answer id", () => {
        expect(new Flashcard("prompt", "answer").id).toEqual("prompt-answer")
    })

    it("Outputs to JSON object", () => {
        
        const dateToUse = new Date();
        const card = new Flashcard("prompt", "answer")
        card.updateLastReviewed(dateToUse);

        expect(card.toJson()).toEqual({
            id:"prompt-answer",
            prompt:"prompt",
            answer:"answer",
            streak:0,
            correctQty:0,
            incorrectQty:0,
            lastReview: dateToUse
        });
    })  
})