import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { styles } from "../../styles/appStyles";
import { FEATURE_TOOLTIPS } from "../../constants/featureTooltips";
import InfoTip from "./InfoTip";
import {
  formatLogTime,
  formatTodayLabel,
  getMealShort,
  MEAL_ORDER,
} from "../../utils/logDisplay";
import { renderHearts, renderStars } from "../../utils/mealRewards";
import { isUnverifiedFoodEntry } from "../../utils/foodEstimator";
import FoodAvoidanceWarning from "./FoodAvoidanceWarning";

function IconRating({ items, variant = "star", label, size = "" }) {
  const char = variant === "heart" ? "♥" : "★";
  return (
    <span className={`icon-rating${size ? ` icon-rating--${size}` : ""}`} aria-label={label}>
      {items.map(({ filled, key }) => (
        <span
          key={key}
          className={`reward-${variant}${filled ? " is-filled" : ""}${size ? ` is-${size}` : ""}`}
          aria-hidden
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export function DailyRewardStrip({ totalPoints, totalHearts, dayPraise, mealCount }) {
  if (mealCount === 0) return null;

  return (
    <div className="daily-reward-strip">
      <div className="daily-reward-strip-main">
        <div className="daily-reward-points-block">
          <span className="daily-reward-points-num">{totalPoints}</span>
          <span className="daily-reward-points-label">แต้มวันนี้</span>
        </div>
        <div className="daily-reward-hearts-block">
          {totalHearts <= 5 ? (
            <IconRating
              items={renderHearts(totalHearts, Math.max(totalHearts, 1))}
              variant="heart"
              label={`${totalHearts} หัวใจ`}
            />
          ) : (
            <span className="daily-reward-hearts-count">♥ {totalHearts}</span>
          )}
        </div>
      </div>
      <p className="daily-reward-praise">{dayPraise}</p>
    </div>
  );
}

export function MealRewardBanner({ reward }) {
  if (!reward) return null;

  return (
    <div className={`meal-reward-banner meal-reward-banner--${reward.tone}`}>
      {!reward.unverified ? (
        <div className="meal-reward-banner-top">
          <span className="meal-reward-stars-wrap">
            <IconRating
              items={renderStars(reward.stars)}
              variant="star"
              label={`${reward.stars} ดาว`}
            />
            <InfoTip tooltip={FEATURE_TOOLTIPS.stars} label="คะแนนดาว" idPrefix="meal-stars" size={14} />
          </span>
          <span className="meal-reward-badge">{reward.badge}</span>
          <span className="meal-reward-points">+{reward.points}</span>
          <IconRating
            items={renderHearts(reward.hearts)}
            variant="heart"
            label={`${reward.hearts} หัวใจ`}
          />
        </div>
      ) : (
        <div className="meal-reward-banner-top meal-reward-banner-top--plain">
          <span className="meal-reward-badge">{reward.badge}</span>
        </div>
      )}
      <p className="meal-reward-praise">{reward.praise}</p>
      {reward.tip ? <p className="meal-reward-tip">{reward.tip}</p> : null}
    </div>
  );
}

export function IncompleteMealsNotice({ overall }) {
  if (!overall || overall.loggedCount >= 3 || overall.loggedCount === 0) return null;

  const missing = (overall.emptyMeals || []).join(", ");

  return (
    <div className="incomplete-meals-notice" aria-live="polite">
      <div className="incomplete-meals-notice-head">
        <span className="incomplete-meals-notice-badge">{overall.loggedCount}/3 มื้อ</span>
        <span className="incomplete-meals-notice-status">{overall.status}</span>
      </div>
      <p className="incomplete-meals-notice-headline">{overall.headline}</p>
      {missing && (
        <p className="incomplete-meals-notice-missing">
          ยังไม่บันทึก: <strong>{missing}</strong>
        </p>
      )}
      {overall.advice && (
        <p className="incomplete-meals-notice-advice">{overall.advice}</p>
      )}
      {overall.nextStep && (
        <p className="incomplete-meals-notice-next">แนะนำ: {overall.nextStep}</p>
      )}
    </div>
  );
}

export function ActiveMealAdvicePanel({ view, mealType }) {
  if (!view) return null;

  return (
    <section
      className={`meal-section-advice active-meal-advice active-meal-advice--${view.tone}`}
      style={{ "--meal-advice-accent": view.accent }}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`คำแนะนำ${mealType}`}
    >
      <div className="meal-section-advice-head">
        <span className="meal-section-advice-badge">{view.badge}</span>
        <span className="meal-section-advice-meta">
          {view.gi && (
            <span className={`meal-gi-badge meal-gi-badge--${view.gi.level === "ต่ำ" ? "low" : view.gi.level === "สูง" ? "high" : "mid"}`}>
              GI ~{view.gi.score} ({view.gi.level})
            </span>
          )}
          {view.cal > 0 && (
            <span className="meal-section-advice-cal">{view.cal} kcal</span>
          )}
        </span>
      </div>

      <p className="meal-section-advice-line active-meal-advice-verdict">{view.verdict}</p>

      {view.headline && view.tone !== "empty" && (
        <p className="meal-section-advice-line active-meal-advice-detail">{view.headline}</p>
      )}

      {view.tone === "empty" && view.headline && (
        <p className="meal-section-advice-line active-meal-advice-detail">{view.headline}</p>
      )}

      {view.macroLine && (
        <p className="active-meal-advice-macro">{view.macroLine}</p>
      )}

      {view.tip && (
        <p className="meal-section-advice-tip">{view.tip}</p>
      )}

      {view.dailyLine && (
        <p className="active-meal-advice-daily">{view.dailyLine}</p>
      )}

      {view.reward && !view.reward.unverified && (
        <div className="active-meal-advice-reward">
          <IconRating items={renderStars(view.reward.stars)} variant="star" label={`${view.reward.stars} ดาว`} />
          <span className="active-meal-advice-reward-text">
            {view.reward.praise} · +{view.reward.points}
          </span>
        </div>
      )}
    </section>
  );
}

export function MealTabStars({ stars }) {
  if (!stars) return null;
  return (
    <span className="meal-tab-stars" aria-hidden>
      {renderStars(stars).map(({ filled, key }) => (
        <span key={key} className={filled ? "reward-star is-filled is-sm" : "reward-star is-sm"}>★</span>
      ))}
    </span>
  );
}

export function DayContextBar({ activeMeal, mode = "food" }) {
  return (
    <div className="day-context-bar">
      <div className="day-context-date">
        <span className="day-context-icon" aria-hidden>📅</span>
        <span className="day-context-date-text">{formatTodayLabel()}</span>
      </div>
      {activeMeal && (
        <div className={`day-context-meal day-context-meal--${mode}`}>
          บันทึก{mode === "activity" ? "ช่วง" : "มื้อ"}: <strong>{getMealShort(activeMeal)}</strong>
        </div>
      )}
    </div>
  );
}

export function DailyTotalsBar({
  foodCals = 0,
  activityCals = 0,
  showNet = true,
  mealTotals = null,
}) {
  const net = foodCals - activityCals;

  return (
    <div className="daily-totals-bar">
      <div className="daily-totals-main">
        <div className="daily-total-cell">
          <span className="daily-total-label">กิน</span>
          <span className="daily-total-value daily-total-value--food">{foodCals} <small>kcal</small></span>
        </div>
        <div className="daily-total-cell">
          <span className="daily-total-label">เผา</span>
          <span className="daily-total-value daily-total-value--burn">−{activityCals} <small>kcal</small></span>
        </div>
        {showNet && (
          <div className="daily-total-cell daily-total-cell--net">
            <span className="daily-total-label">สุทธิ</span>
            <span className="daily-total-value daily-total-value--net">{net} <small>kcal</small></span>
          </div>
        )}
      </div>
      {mealTotals && (
        <div className="daily-meal-totals-row">
          {MEAL_ORDER.map((mealType) => (
            <div key={mealType} className="daily-meal-total-chip">
              <span className="daily-meal-total-name">{getMealShort(mealType)}</span>
              <span className="daily-meal-total-cal">
                {mealTotals[mealType] > 0 ? mealTotals[mealType] : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MealLogSection({
  mealType,
  totalCals,
  children,
  emptyText = "—",
  variant = "food",
  reward = null,
  gi = null,
  avoidanceKeywords = [],
}) {
  const totalLabel = totalCals > 0
    ? (variant === "activity" ? `−${totalCals} kcal` : `${totalCals} kcal`)
    : emptyText;

  return (
    <section className={`meal-log-section meal-log-section--${variant}`}>
      <header className="meal-log-section-head">
        <span className="meal-log-section-name">{mealType}</span>
        <span className="meal-log-section-meta">
          {gi && (
            <span className={`meal-gi-badge meal-gi-badge--${gi.level === "ต่ำ" ? "low" : gi.level === "สูง" ? "high" : "mid"}`}>
              GI ~{gi.score} ({gi.level})
              <InfoTip tooltip={FEATURE_TOOLTIPS.gi} label="ดัชนี GI" idPrefix={`gi-${mealType}`} size={13} />
            </span>
          )}
          <span className="meal-log-section-total">{totalLabel}</span>
        </span>
      </header>
      {avoidanceKeywords.length > 0 ? (
        <FoodAvoidanceWarning keywords={avoidanceKeywords} variant="meal" />
      ) : null}
      {reward && <MealRewardBanner reward={reward} />}
      {children}
    </section>
  );
}

export function FoodLogRow({ item, onRemove, avoidanceKeywords = [] }) {
  const unverified = isUnverifiedFoodEntry(item);
  const hasAvoidance = avoidanceKeywords.length > 0;
  return (
    <div className={`log-entry-row log-entry-row--food${unverified ? " is-unverified" : ""}${hasAvoidance ? " has-avoidance" : ""}`}>
      <span className="log-entry-time">{formatLogTime(item.loggedAt)}</span>
      <span className="log-entry-name">
        {hasAvoidance ? <span className="log-entry-allergy-badge">แพ้</span> : null}
        {item.name}
        {unverified ? <small className="log-entry-estimate-tag"> · ประมาณ</small> : null}
        {hasAvoidance ? (
          <small className="log-entry-allergy-note"> · มี{avoidanceKeywords.join(", ")}</small>
        ) : null}
      </span>
      <span className="log-entry-kcal">{item.calories} kcal</span>
      {onRemove && (
        <button type="button" className="log-entry-delete" onClick={onRemove} style={styles.btnDelete} aria-label="ลบ">
          <MdDeleteOutline size={18} />
        </button>
      )}
    </div>
  );
}

export function ActivityLogRow({ item, onRemove }) {
  return (
    <div className="log-entry-row log-entry-row--activity">
      <span className="log-entry-time">{formatLogTime(item.loggedAt)}</span>
      <span className="log-entry-meal">{getMealShort(item.mealPeriod)}</span>
      <span className="log-entry-name">{item.name}</span>
      <span className="log-entry-meta">{item.durationMinutes} น.</span>
      <span className="log-entry-kcal log-entry-kcal--burn">−{item.calories}</span>
      {onRemove && (
        <button type="button" className="log-entry-delete" onClick={onRemove} style={styles.btnDelete} aria-label="ลบ">
          <MdDeleteOutline size={18} />
        </button>
      )}
    </div>
  );
}

export function LogListHeader({ variant = "food" }) {
  if (variant === "activity") {
    return (
      <div className="log-list-header log-list-header--activity" aria-hidden>
        <span>เวลา</span>
        <span>ช่วง</span>
        <span>กิจกรรม</span>
        <span>นาที</span>
        <span>kcal</span>
        <span />
      </div>
    );
  }

  return (
    <div className="log-list-header log-list-header--food" aria-hidden>
      <span>เวลา</span>
      <span>รายการ</span>
      <span>kcal</span>
      <span />
    </div>
  );
}

export function EmptyLogHint({ text }) {
  return <p className="log-empty-hint">{text}</p>;
}

export function DashboardDaySummary({ foodCals, activityCals, mealTotals, dailyRewards }) {
  return (
    <section className="dashboard-day-summary">
      <div className="dashboard-day-summary-date">{formatTodayLabel()}</div>
      <DailyTotalsBar
        foodCals={foodCals}
        activityCals={activityCals}
        mealTotals={mealTotals}
      />
      {dailyRewards && (
        <DailyRewardStrip
          totalPoints={dailyRewards.totalPoints}
          totalHearts={dailyRewards.totalHearts}
          dayPraise={dailyRewards.dayPraise}
          mealCount={dailyRewards.mealCount}
        />
      )}
    </section>
  );
}
