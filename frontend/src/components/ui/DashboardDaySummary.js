import React from "react";
import { formatTodayLabel, mealSummariesFromDaily } from "../../utils/logDisplay";
import { DailyRewardStrip, DailyTotalsBar } from "./DailyLogDisplay";
import "./DailyLogDisplay.css";

const fmt = (n) => Math.round(n).toLocaleString("th-TH");

function DayMealCard({ meal }) {
  const hasFood = meal.foods.length > 0;
  const hasActivity = meal.activities.length > 0;

  return (
    <div className={`day-meal-card${hasFood ? " has-data" : ""}`}>
      <h4 className="day-meal-card-title">{meal.mealType}</h4>
      {hasFood ? (
        <p className="day-meal-card-items">{meal.foodNames.join(" · ")}</p>
      ) : (
        <p className="day-meal-card-empty">ยังไม่มีรายการอาหาร</p>
      )}
      {hasActivity ? (
        <p className="day-meal-card-activity">
          กิจกรรม: {meal.activityNames.join(" · ")}
        </p>
      ) : null}
      <p className="day-meal-card-energy">
        {hasFood ? `${fmt(meal.calories)} กิโลแคลอรี` : "—"}
      </p>
      {hasFood ? (
        <p className="day-meal-card-macros">
          โปรตีน {fmt(meal.protein)} กรัม · คาร์โบไฮเดรต {fmt(meal.carbs)} กรัม · ไขมัน {fmt(meal.fat)} กรัม
        </p>
      ) : null}
      {hasActivity ? (
        <p className="day-meal-card-burn">
          พลังงานที่เผาผลาญ {fmt(meal.burned)} กิโลแคลอรี
        </p>
      ) : null}
    </div>
  );
}

export default function DashboardDaySummary({
  foodCals = 0,
  activityCals = 0,
  dailyMeals = {},
  activities = [],
  dailyRewards,
}) {
  const meals = mealSummariesFromDaily(dailyMeals, activities);

  return (
    <section className="dashboard-day-summary dash-home-meals-block">
      <h2 className="dashboard-day-summary-heading">สรุปแต่ละมื้อวันนี้</h2>
      <div className="dashboard-day-summary-date">{formatTodayLabel()}</div>
      <DailyTotalsBar foodCals={foodCals} activityCals={activityCals} />
      <div className="day-meal-summaries">
        {meals.map((meal) => (
          <DayMealCard key={meal.mealType} meal={meal} />
        ))}
      </div>
      {dailyRewards ? (
        <DailyRewardStrip
          totalPoints={dailyRewards.totalPoints}
          totalHearts={dailyRewards.totalHearts}
          dayPraise={dailyRewards.dayPraise}
          mealCount={dailyRewards.mealCount}
        />
      ) : null}
    </section>
  );
}
