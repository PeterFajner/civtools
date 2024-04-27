import { CivCard, DiscountTuple, calculateDiscount } from "./CivCard";

const findSets = (
  cards: CivCard[],
  cash: number,
  discounts: DiscountTuple[],
  maxNum = 100
) => {
  const sets: CivCard[][] = [];
  const stack: [CivCard[], number, number][] = [[[], cash, 0]];

  while (stack.length > 0 && sets.length < maxNum) {
    const [currentSet, remaining, index] = stack.pop()!;
    for (let i = index; i < cards.length; i++) {
      const card = cards[i];
      const newRemaining =
        remaining - (card.cost - calculateDiscount(card, discounts));
      if (newRemaining >= 0) {
        const newSet = [...currentSet, card];
        sets.push(newSet);
        stack.push([newSet, newRemaining, i + 1]);
      }
    }
  }

  return sets.length > maxNum ? sets.slice(0, maxNum) : sets;
};

export default findSets;
