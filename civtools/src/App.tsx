import { useMemo, useState } from "react";
import "./App.css";
import { CivCard } from "./CivCard";
import { CardList } from "./CivCardList.json";

const cards = CardList as CivCard[];

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
        </ul>
      </div>
      <button onClick={remove}>Remove</button>
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

  console.debug({ cards, discounts });

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
    </>
  );
};

export default App;
