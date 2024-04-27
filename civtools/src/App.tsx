import { useMemo, useState } from "react";
import "./App.css";
import { CivCard, DiscountTuple, calculateDiscount } from "./CivCard";
import { CardList } from "./CivCardList.json";
import findSets from "./findSets";

const cards = CardList as CivCard[];

const getSetValue = (set: CivCard[], discounts: DiscountTuple[]) =>
  set.reduce(
    (total, card) => total + card.cost - calculateDiscount(card, discounts),
    0
  );

const Card = ({ card, remove }: { card: CivCard; remove: () => void }) => {
  return (
    <div>
      <h3>{card.cardName}</h3>
      <div>Cost: {card.cost}</div>
      <div>Points: {card.points}</div>
      <div>Colors: {card.colors.join(", ")}</div>
      <div>
        Discounts:
        <ul>
          {card.colorDiscounts.map((discount) => (
            <li key={discount.color}>
              {discount.color}: {discount.discount}
            </li>
          ))}
          {card.cardDiscount && (
            <li>
              {card.cardDiscount.cardName}: {card.cardDiscount.discount}
            </li>
          )}
        </ul>
      </div>
      <button onClick={remove}>Remove</button>
    </div>
  );
};

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
    <div>
      <h3>
        {set.map((card) => card.cardName).join(", ")} -{" "}
        {getSetValue(set, discounts)} resources, total discount{" "}
        {set.reduce(
          (total, card) => total + calculateDiscount(card, discounts),
          0
        )}
      </h3>
      <button onClick={buy}>Buy</button>
    </div>
  );
};

const App = () => {
  const [cash, setCash] = useState(0);
  const [inventory, setInventory] = useState<CivCard[]>([]);

  const discounts = useMemo(
    () =>
      inventory
        .flatMap((card) => [card.cardDiscount, ...card.colorDiscounts])
        .filter(Boolean),
    [inventory]
  );

  const cardsNotInInventory = useMemo(
    () => cards.filter((card) => !inventory.includes(card)),
    [inventory]
  );

  const setsAvailable = useMemo(() => {
    return findSets(cardsNotInInventory, cash).sort(
      // sort from highest (discounted) value to lowest
      (a, b) => getSetValue(b, discounts) - getSetValue(a, discounts)
    );
  }, [cardsNotInInventory, cash, discounts]);

  console.debug({ cards, discounts, setsAvailable });

  return (
    <>
      <h1>Civ Shop Helper</h1>
      <div>
        <h2>Cash</h2>
        <input
          type="number"
          value={cash}
          onChange={(e) => setCash(Number(e.target.value))}
        />
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
        {cards
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
        <h3>Available sets</h3>
        {setsAvailable.length ? (
          setsAvailable.map((set, i) => (
            <ShopSet
              key={i}
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
