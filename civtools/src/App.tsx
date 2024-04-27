import { useMemo, useState } from "react";
import "./App.css";
import { CivCard, Color, DiscountTuple, calculateDiscount } from "./CivCard";
import { CardList } from "./CivCardList.json";
import { Card, CardColor } from "./components/Card";
import findSets from "./findSets";

const sortAlphabetically = (a: CivCard, b: CivCard) =>
  a.cardName < b.cardName ? -1 : a.cardName > b.cardName ? 1 : 0;

const sortByCost = (a: CivCard, b: CivCard) => a.cost - b.cost;

const cards = (CardList as CivCard[]).sort(sortByCost);
const cardsAlphabetical = (CardList as CivCard[]).sort(sortAlphabetically);

const getSetValue = (set: CivCard[], discounts: DiscountTuple[]) =>
  Math.max(
    set.reduce(
      (total, card) => total + card.cost - calculateDiscount(card, discounts),
      0
    ),
    0
  );

const getTotalDiscount = (set: CivCard[], discounts: DiscountTuple[]) =>
  set.reduce((total, card) => total + calculateDiscount(card, discounts), 0);

const ShopSet = ({
  set,
  discounts,
  buy,
}: {
  set: CivCard[];
  discounts: DiscountTuple[];
  buy: () => void;
}) => {
  return (
    <div className="shopSetWrapper">
      <div className="shopSet">
        <div className="shopSetHeader">
          <p>{set.map((card) => card.cardName).join(", ")}</p>
          <p>${getSetValue(set, discounts)}</p>
          <p>Total discount ${getTotalDiscount(set, discounts)}</p>

          <button onClick={buy}>Buy</button>
        </div>
        {set.map((card) => (
          <Card key={card.cardName} card={card} />
        ))}
      </div>
    </div>
  );
};

const ManualDiscount = ({
  color,
  discount,
  setDiscount,
  allDiscounts,
}: {
  color: string;
  discount: number;
  setDiscount: (value: number) => void;
  allDiscounts: DiscountTuple[];
}) => {
  return (
    <div className="manualDiscount">
      <CardColor color={color} />
      <input
        type="text"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
        min={0}
        max={1000}
        pattern="[0-9]*"
        inputMode="numeric"
      />
      <span>
        {allDiscounts
          .filter((d) => d.color === color)
          .reduce((total, d) => total + d.discount, 0)}
      </span>
    </div>
  );
};

const DISCOUNT_NAMES = ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE"];

const App = () => {
  const [cash, setCash] = useState(0);
  const [inventory, setInventory] = useState<CivCard[]>([]);
  const [manualDiscounts, setManualDiscounts] = useState<
    Record<string, number>
  >({});
  const [sortByDiscount, setSortByDiscount] = useState(false);

  const cardDiscounts = useMemo(
    () =>
      inventory
        .flatMap((card) => [card.cardDiscount, ...card.colorDiscounts])
        .filter(Boolean),
    [inventory]
  );

  const discounts: DiscountTuple[] = useMemo(
    () => [
      ...cardDiscounts,
      ...Object.entries(manualDiscounts).map(([color, discount]) => ({
        cardName: "COLOR",
        color: color as Color,
        discount,
      })),
    ],
    [cardDiscounts, manualDiscounts]
  );

  const cardsNotInInventory = useMemo(
    () => cards.filter((card) => !inventory.includes(card)),
    [inventory]
  );

  const setsAvailable = useMemo(() => {
    return findSets(cardsNotInInventory, cash).sort((a, b) =>
      sortByDiscount
        ? getTotalDiscount(b, discounts) - getTotalDiscount(a, discounts)
        : getSetValue(b, discounts) - getSetValue(a, discounts)
    );
  }, [cardsNotInInventory, cash, discounts, sortByDiscount]);

  return (
    <>
      <h1>Civ Shop Helper</h1>
      <div>
        <h2>Cash</h2>
        <input
          type="text"
          value={Number(cash) || ""}
          onChange={(e) => setCash(Number(e.target.value) || 0)}
          min={0}
          max={1000}
          pattern="[0-9]*"
          inputMode="numeric"
        />
      </div>
      <h2>Discounts</h2>
      <div className="manualDiscounts">
        {DISCOUNT_NAMES.map((color) => (
          <ManualDiscount
            key={color}
            color={color}
            allDiscounts={discounts}
            discount={manualDiscounts[color]}
            setDiscount={(discount: number) =>
              setManualDiscounts({ ...manualDiscounts, [color]: discount })
            }
          />
        ))}
      </div>
      <h2>Inventory</h2>
      <h3>Add a card:</h3>
      <select
        value=""
        onChange={(e) =>
          setInventory([
            ...inventory,
            cards.find((card) => card.cardName === e.target.value)!,
          ])
        }
      >
        <option value="">Select a card</option>
        {cardsAlphabetical
          .filter((card) => !inventory.includes(card))
          .map((card) => (
            <option key={card.cardName} value={card.cardName}>
              {card.cardName}
            </option>
          ))}
      </select>
      <div>
        {inventory.map((card) => (
          <Card
            key={card.cardName}
            card={card}
            remove={() => setInventory(inventory.filter((c) => c !== card))}
          />
        ))}
      </div>
      <h2>Shop</h2>
      <div>
        <input
          type="radio"
          id="sortByCost"
          name="sort"
          checked={!sortByDiscount}
          onChange={() => setSortByDiscount(false)}
        />
        <label htmlFor="sortByCost">Sort by cost</label>
        <input
          type="radio"
          id="sortByDiscount"
          name="sort"
          checked={sortByDiscount}
          onChange={() => setSortByDiscount(true)}
        />
        <label htmlFor="sortByDiscount">Sort by discount</label>
      </div>
      <div>
        {setsAvailable.length ? (
          setsAvailable.map((set) => (
            <ShopSet
              key={set.map((card) => card.cardName).join("")}
              set={set}
              discounts={discounts}
              buy={() => {
                setCash(cash - getSetValue(set, discounts));
                setInventory([...inventory, ...set]);
              }}
            />
          ))
        ) : (
          <p>No sets available</p>
        )}
      </div>
    </>
  );
};

export default App;
