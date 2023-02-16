export default function sum(...numbers: number[]) {
    return numbers.reduce((total, number) => total + number, 0)
}

if (import.meta.vitest) {

    const { describe, expect, it } = import.meta.vitest;

    describe("#sum", ()=> {
        it("returns 0 with no numbers", () => {
            expect(sum()).toBe(0);
        })

        it("returns 6 with [1, 2, 3]", () => {
            expect(sum(1, 2, 3)).toBe(6);
        })
    })
}