import { CivCard } from "./CivCard";

const findSets = (cards: CivCard[], cash: number, currentSet: CivCard[] = []) => {
    const sets: CivCard[][] = [];
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const remaining = cash - card.cost;
        if (remaining >= 0) {
            sets.push([...currentSet, card]);
            sets.push(...findSets(cards.slice(i + 1), remaining, [...currentSet, card]));
        }
    }
    return sets;
}

export default findSets;
