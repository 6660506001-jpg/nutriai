import React from "react";
import { FOOD_BG_TILES } from "../../constants/foodBackground";

export default function FoodCollageBackground() {
  return (
    <div className="nutri-food-wash" aria-hidden="true">
      <div className="nutri-food-wash-mosaic">
        {FOOD_BG_TILES.map((src) => (
          <div
            key={src}
            className="nutri-food-wash-tile"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>
      <div className="nutri-food-wash-veil" />
    </div>
  );
}
