import { CivCard } from "./CivCard";

const findSets = (
    cards: CivCard[],
    cash: number,
    maxNum = 1000
) => {
    const sets: CivCard[][] = [];
    const stack: [CivCard[], number, number][] = [[[], cash, 0]];

    while (stack.length > 0 && sets.length < maxNum) {
        const [currentSet, remaining, index] = stack.pop()!;
        for (let i = index; i < cards.length; i++) {
            const card = cards[i];
            const newRemaining = remaining - card.cost;
            if (newRemaining >= 0) {
                const newSet = [...currentSet, card];
                sets.push(newSet);
                stack.push([newSet, newRemaining, i + 1]);
            }
        }
    }

    return sets;
};

export default findSets;
