import { CivCard, ColorHex } from "../CivCard";

export const CardColor = ({ color }: { color: string }) => {
  return (
    <span
      className="cardColor"
      style={{
        color: ColorHex[color as keyof typeof ColorHex],
      }}
    >
      {color}
    </span>
  );
};

export const Card = ({
  card,
  remove,
}: {
  card: CivCard;
  remove?: () => void;
}) => {
  return (
    <div className="card">
      <div className="cardHeader">{card.cardName}</div>
      <div className="cardBody">
        <div className="cardStats">
          <div className="cardCost">${card.cost}</div>
          <div className="cardPoints">{card.points} points</div>
          <div className="cardColors">
            {card.colors.map((color) => (
              <CardColor key={color} color={color} />
            ))}
          </div>
        </div>
        <div>
          <h5>Discounts</h5>
          <ul>
            {card.colorDiscounts.map((discount) => (
              <li key={discount.color}>
                <CardColor color={discount.color} />: {discount.discount}
              </li>
            ))}
            {card.cardDiscount.discount > 0 && (
              <li>
                {card.cardDiscount.cardName}: {card.cardDiscount.discount}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="cardFooter">
        {remove && (
          <button className="remove" onClick={remove}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
