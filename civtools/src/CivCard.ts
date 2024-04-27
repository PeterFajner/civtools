export type Color = "RED" | "ORANGE" | "YELLOW" | "GREEN" | "BLUE" | "CARD";

export type DiscountTuple = {
  cardName: string;
  color: Color;
  discount: number;
};

export type CivCard = {
  cardName: string;
  cost: number;
  points: number;
  colors: Color[];
  colorDiscounts: DiscountTuple[];
  cardDiscount: DiscountTuple;
};

// calculate the discount for a specific color of a card
const calculateDiscountForColor = (
  card: CivCard,
  color: Color,
  discounts: DiscountTuple[]
): number =>
  discounts.reduce(
    (totalDiscount, discountTuple) =>
      totalDiscount +
      (color === discountTuple.color ||
      (discountTuple.color === Color.CARD &&
        discountTuple.cardName === card.cardName)
        ? discountTuple.discount
        : 0),
    0
  );

// since a card can have multiple colors, we need to find the maximum discount among all colors
export const calculateDiscount = (
  card: CivCard,
  discounts: DiscountTuple[]
): number =>
  card.colors.reduce((maxDiscount, color) =>
    Math.max(maxDiscount, calculateDiscountForColor(card, color, discounts), 0)
  );

// class CivCardClass {
//             cardName: string;
//             cost: number;
//             modifiedCost: number;
//             points: number;
//             colors: Color[];
//             colorDiscounts: DiscountTuple[];
//             cardDiscount: DiscountTuple;
//             constructor(cardName: string, cost: number, points: number, colors: Color[], colorDiscounts: DiscountTuple[], cardDiscount: DiscountTuple) {
//                 this.cardName = cardName;
//                 this.cost = cost;
//                 this.modifiedCost = cost;
//                 this.points = points;
//                 this.colors = colors;
//                 this.colorDiscounts = colorDiscounts;
//                 this.cardDiscount = cardDiscount;
//             }

//             getName() {
//                 return this.cardName;
//             }
//             getCost() {
//                 return this.cost;
//             }
//             getModifiedCost() {
//                 return this.modifiedCost;
//             }
//             getPoints() {
//                 return this.points;
//             }
//             getColors() {
//                 return this.colors;
//             }
//             getColorDiscounts() {
//                 return this.colorDiscounts;
//             }
//             getCardDiscount() {
//                 return this.cardDiscount;
//             }
//             setModifiedCost(totalColorDiscounts: DiscountTuple[], cardDiscounts: DiscountTuple[]) {
//                 let maxDiscount = 0;
//                 totalColorDiscounts.forEach(discountTuple => {
//                     if (this.colors.find((cardColor) => cardColor === discountTuple.color) != undefined && discountTuple.discount > maxDiscount) {
//                         maxDiscount = discountTuple.discount;
//                     }
//                 });
//                 let cardDiscountTuple = cardDiscounts.find((discountTuple) => discountTuple.cardName === this.cardName)
//                 if (cardDiscountTuple != undefined) {
//                     maxDiscount += cardDiscountTuple.discount;
//                 }
//                 this.modifiedCost = this.cost - maxDiscount;
//             }
//         }
