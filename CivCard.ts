class CivCard {
    cardName: string;
    cost: number;
    modifiedCost: number;
    points: number;
    colors: Colors[];
    colorDiscounts: DiscountTuple[];
    cardDiscount: DiscountTuple;
    constructor(cardName: string, cost: number, points: number, colors: Colors[], colorDiscounts: DiscountTuple[], cardDiscount: DiscountTuple) {
        this.cardName = cardName;
        this.cost = cost;
        this.modifiedCost = cost;
        this.points = points;
        this.colors = colors;
        this.colorDiscounts = colorDiscounts;
        this.cardDiscount = cardDiscount;
    }

    getName() {
        return this.cardName;
    }
    getCost() {
        return this.cost;
    }
    getModifiedCost() {
        return this.modifiedCost;
    }
    getPoints() {
        return this.points;
    }
    getColors() {
        return this.colors;
    }
    getColorDiscounts() {
        return this.colorDiscounts;
    }
    getCardDiscount() {
        return this.cardDiscount;
    }
    setModifiedCost(totalColorDiscounts: DiscountTuple[], cardDiscounts : DiscountTuple[]) {
        let maxDiscount = 0;
        totalColorDiscounts.forEach(discountTuple => {
            if (this.colors.find((cardColor) => cardColor === discountTuple.color) != undefined && discountTuple.discount > maxDiscount) {
                maxDiscount = discountTuple.discount;
            }
        });
        let cardDiscountTuple = cardDiscounts.find((discountTuple) => discountTuple.cardName === this.cardName)
        if (cardDiscountTuple != undefined) {
                maxDiscount += cardDiscountTuple.discount;
        }
        this.modifiedCost = this.cost - maxDiscount;
    }
}

enum Colors {
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    CARD
}

interface DiscountTuple {
    cardName: string,
    color : Colors,
    discount : number
}
