import React from "react";
import { LOGIN_FOOD_BG } from "../../constants/config";

export default function BlurredFoodBackground() {
  return (
    <div className="nutri-blurred-food-bg" aria-hidden="true">
      <div
        className="nutri-blurred-food-bg-image"
        style={{ backgroundImage: `url('${LOGIN_FOOD_BG}')` }}
      />
      <div className="nutri-blurred-food-bg-scrim" />
    </div>
  );
}
