import React, { useState, useEffect, useMemo } from "react";
import { HiSparkles } from "react-icons/hi";
import DashCollapsible from "../ui/DashCollapsible";
import { STAT_TOOLTIPS, getWeightControlTarget } from "../../constants/statTooltips";
import { calculateHealthData, calculateMacros } from "../../utils/healthCalculations";
import { analyzeThreeMealsSummary } from "../../utils/mealRecommendations";
import { getProfessionalPrediction } from "../../utils/aiPrediction";
import { generateMenuRecommendations, VENUE_MODES } from "../../utils/menuRecommendations";
import { buildAdaptiveActivitySuggestion } from "../../utils/adaptiveActivitySuggester";
import { mealTotalsFromDaily } from "../../utils/logDisplay";
import { summarizeDailyRewards } from "../../utils/mealRewards";
import { styles } from "../../styles/appStyles";
import MetricCard from "../ui/MetricCard";
import DashboardStatusHero from "../ui/DashboardStatusHero";
import HomeActionGrid from "../ui/HomeActionGrid";
import MenuRecommendationCard from "../ui/MenuRecommendationCard";
import AiMacroMeters from "../ui/AiMacroMeters";
import WhatIfFoodSimulator from "../ui/WhatIfFoodSimulator";
import FoodPortionModal from "../ui/FoodPortionModal";
import MenuRecommendationPrefs from "../ui/MenuRecommendationPrefs";
import { canSaveFoodEntry } from "../../utils/foodEstimator";
import {
  appendFoodPreference,
  inferDislikeKeywordFromMenu,
  normalizeFoodPreferences,
} from "../../utils/foodPreferences";
import { DashboardDaySummary } from "../ui/DailyLogDisplay";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function Dashboard({
  user,
  setUser,
  dailyMeals,
  setDailyMeals,
  activities,
  activeMealTab,
  onNavigateToFood,
  onNavigateToActivity,
  onNavigateToMeals,
  onOpenGuide,
  viewMode = "home",
}) {
  const isMobile = useIsMobile();
  const mealPlanRef = React.useRef(null);
  const [aiOpen, setAiOpen] = useState(viewMode === "meals" || false);
  const [pendingFood, setPendingFood] = useState(null);
  const [menuRecommendations, setMenuRecommendations] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [showMenuRecommendations, setShowMenuRecommendations] = useState(false);
  const [menuVenueMode, setMenuVenueMode] = useState("home");
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const { bmi } = calculateHealthData(user);

  const handleConfirmFood = (foodEntry) => {
    if (!canSaveFoodEntry(foodEntry)) {
      alert("ไม่สามารถคำนวนเมนูอาหารนี้ได้");
      return;
    }
    setDailyMeals((prev) => ({
      ...prev,
      [activeMealTab]: [...prev[activeMealTab], {
        ...foodEntry,
        loggedAt: foodEntry.loggedAt || new Date().toISOString(),
        loggedDate: foodEntry.loggedDate || new Date().toLocaleDateString("en-CA"),
        mealPeriod: activeMealTab,
      }],
    }));
    setPendingFood(null);
  };

  const foodCals = Object.values(dailyMeals).flat().reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
  const mealTotals = mealTotalsFromDaily(dailyMeals);
  const activityCals = activities.reduce((sum, a) => sum + (Number(a.calories) || 0), 0);
  const netCals = foodCals - activityCals;
  const macros = calculateMacros(user.tdee);

  const totalEaten = Object.values(dailyMeals).flat().reduce((acc, f) => ({
    p: acc.p + (Number(f.protein) || 0),
    c: acc.c + (Number(f.carbs) || 0),
    f: acc.f + (Number(f.fat) || 0),
    cal: acc.cal + (Number(f.calories) || 0)
  }), { p: 0, c: 0, f: 0, cal: 0 });

  const analysis = getProfessionalPrediction({
    tdee: user.tdee,
    foodCals,
    activityCals,
    macros,
    totalEaten
  });

  const activitySuggestion = useMemo(() => {
    const pct = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0);
    return buildAdaptiveActivitySuggestion({
      macros,
      totalEaten,
      userWeight: user.weight,
      remainingCal: (Number(user.tdee) || 0) - netCals,
      proteinPct: pct(totalEaten.p, macros.protein),
      carbsPct: pct(totalEaten.c, macros.carbs),
      fatPct: pct(totalEaten.f, macros.fat),
    });
  }, [macros, totalEaten, user.weight, user.tdee, netCals]);

  useEffect(() => {
    setShowMenuRecommendations(false);
    setMenuRecommendations([]);
  }, [foodCals, activityCals, user.tdee, totalEaten.cal]);

  const mealsAnalysis = analyzeThreeMealsSummary(dailyMeals, {
    tdee: user.tdee,
    activityCals,
    activities,
  });

  const dailyRewards = summarizeDailyRewards(mealsAnalysis.perMeal);

  const hasMealsLogged = mealsAnalysis.overall.loggedCount > 0;
  const hasRecordsLogged = hasMealsLogged || activities.length > 0;

  useEffect(() => {
    if (viewMode !== "meals") return;
    setAiOpen(true);
    const timer = window.setTimeout(() => {
      mealPlanRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [viewMode]);

  const fetchMenuRecommendations = async (
    venueMode = menuVenueMode,
    prefs = user?.foodPreferences,
    options = {},
  ) => {
    if (!analysis.recommendationTargets?.canRecommend) return;
    setMenuLoading(true);
    setMenuRecommendations([]);
    try {
      const menus = await generateMenuRecommendations(
        {
          ...analysis.recommendationTargets,
          foodPreferences: prefs,
          shuffleMenus: options.shuffle !== false,
          excludeMenuNames: options.excludeMenuNames || [],
        },
        venueMode,
      );
      setMenuRecommendations(menus);
    } catch (err) {
      console.error("Menu recommendation error:", err);
      setMenuRecommendations([]);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleGenerateMenuRecommendations = async () => {
    setShowMenuRecommendations(true);
    await fetchMenuRecommendations(menuVenueMode, user?.foodPreferences, { shuffle: false });
  };

  const refreshMenusWithPreferences = async (nextPreferences, options = {}) => {
    setUser((prev) => ({ ...prev, foodPreferences: nextPreferences }));
    await fetchMenuRecommendations(menuVenueMode, nextPreferences, {
      shuffle: true,
      ...options,
    });
  };

  const handleMenuPreferenceAction = async ({ type, keyword }) => {
    let nextPreferences = normalizeFoodPreferences(user?.foodPreferences);
    if (type === "like" && keyword) {
      nextPreferences = appendFoodPreference(nextPreferences, "like", keyword);
    } else if (type === "dislike" && keyword) {
      nextPreferences = appendFoodPreference(nextPreferences, "dislike", keyword);
    }
    await refreshMenusWithPreferences(nextPreferences, {
      excludeMenuNames: menuRecommendations.map((menu) => menu.name),
    });
  };

  const handleDislikeRecommendedMenu = async (menu) => {
    const keyword = inferDislikeKeywordFromMenu(menu.name);
    const nextPreferences = appendFoodPreference(user?.foodPreferences, "dislike", keyword);
    await refreshMenusWithPreferences(nextPreferences, {
      excludeMenuNames: [menu.name, ...menuRecommendations.map((item) => item.name)],
    });
  };

  const handleMenuVenueModeChange = async (mode) => {
    setMenuVenueMode(mode);
    if (showMenuRecommendations) {
      await fetchMenuRecommendations(mode);
    }
  };

  const handleAddRecommendedMenu = (menu) => {
    setPendingFood({
      name: menu.name,
      calories: menu.calories,
      protein: menu.protein,
      carbs: menu.carbs,
      fat: menu.fat,
    });
  };

  const handleWhatIfSelectFood = (food) => {
    if (!food) return;
    setPendingFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      custom: food.custom ?? food.estimated ?? true,
    });
  };

  const handleLogSuggestedActivity = () => {
    if (!activitySuggestion?.show) return;
    onNavigateToActivity({
      activity: activitySuggestion.activity,
      durationMinutes: activitySuggestion.durationMinutes,
      intensity: activitySuggestion.intensity,
    });
  };

  const weightControlTarget = getWeightControlTarget(user.tdee);
  const summaryPreview = hasRecordsLogged
    ? `กิน ${foodCals} · เผา ${activityCals} · สุทธิ ${netCals >= 0 ? netCals : `−${Math.abs(netCals)}`} kcal`
    : "";

  return (
    <div style={styles.pageLayout} className={`dashboard-overview dashboard-home-simple dashboard-view-${viewMode}`}>
      {viewMode === "meals" && (
        <section className="dash-meals-intro" aria-label="คำอธิบายเมนูแนะนำ">
          <strong>เมนูแนะนำจาก AI</strong>
          <p>ระบบคัดเมนูตามแคลที่เหลือและอาหารที่คุณหลีกเลี่ยง — กด「เลือกเมนู」เพื่อบันทึก</p>
        </section>
      )}

      {viewMode === "home" && !hasRecordsLogged && !isMobile && (
        <section className="dash-welcome-banner" aria-label="เริ่มต้นใช้งาน">
          <div className="dash-welcome-banner-main">
            <div className="dash-welcome-banner-body">
              <strong className="dash-welcome-banner-title">ยินดีต้อนรับ</strong>
              <p className="dash-welcome-banner-text">
                เริ่มจาก「บันทึกอาหาร」ด้านล่าง — เลือกมื้อที่กิน แล้วค้นหาชื่อเมนู
              </p>
            </div>
          </div>
          <div className="dash-welcome-banner-actions">
            <button type="button" className="dash-welcome-primary" onClick={onNavigateToFood}>
              บันทึกมื้อแรก
            </button>
            {onOpenGuide ? (
              <button type="button" className="dash-welcome-secondary" onClick={onOpenGuide}>
                ดูวิธีใช้
              </button>
            ) : null}
          </div>
        </section>
      )}

      {viewMode === "home" && (
        <DashboardStatusHero
          username={user.username}
          tdee={user.tdee}
          target={weightControlTarget || user.tdee}
          foodCals={foodCals}
          activityCals={activityCals}
          netCals={netCals}
          onLogFood={onNavigateToFood}
          onLogActivity={() => onNavigateToActivity()}
          showActions={isMobile}
        />
      )}

      {viewMode === "home" && !isMobile && (
        <HomeActionGrid
          foodCals={foodCals}
          activityCals={activityCals}
          mealPoints={dailyRewards.totalPoints}
          onFood={onNavigateToFood}
          onActivity={() => onNavigateToActivity()}
          onMeals={onNavigateToMeals}
        />
      )}

      {viewMode === "home" && !isMobile && (
        <div className="dash-body-section">
          <p className="dash-section-label">ข้อมูลร่างกาย</p>
          <div className="dash-secondary-metrics">
            <MetricCard label="น้ำหนัก" value={user.weight} unit="kg" tooltip={STAT_TOOLTIPS.weight} compact />
            <MetricCard label="BMI" value={bmi} tooltip={STAT_TOOLTIPS.bmi} compact />
          </div>
        </div>
      )}

      {viewMode === "home" && hasRecordsLogged && (
        <DashCollapsible
          className="dash-collapse-summary"
          title="สรุปวันนี้"
          preview={summaryPreview}
          defaultOpen={false}
        >
          <DashboardDaySummary
            foodCals={foodCals}
            activityCals={activityCals}
            mealTotals={mealTotals}
            dailyRewards={dailyRewards}
          />
        </DashCollapsible>
      )}

      {viewMode === "meals" && analysis.recommendationTargets?.canRecommend && !showMenuRecommendations && (
        <div className="dash-meals-empty-cta">
          <p>ยังไม่มีเมนูแนะนำ — กดปุ่มด้านล่างเพื่อให้ AI คัดเมนูให้</p>
          <button
            type="button"
            className="dash-welcome-primary"
            onClick={handleGenerateMenuRecommendations}
            disabled={menuLoading}
          >
            {menuLoading ? "กำลังคำนวณ..." : "ดูเมนูแนะนำ"}
          </button>
        </div>
      )}

      {viewMode === "meals" && (
      <div id="dash-meal-plan" ref={mealPlanRef}>
      <DashCollapsible
        className="dash-collapse-ai dash-ai-simple"
        style={styles.aiCardShell}
        title="เมนูแนะนำ"
        icon={<HiSparkles />}
        preview={analysis.headline}
        badge={analysis.badge}
        open={aiOpen}
        onOpenChange={setAiOpen}
        collapseOnMobile={true}
        defaultOpen
      >
        <div className="dash-ai-hero">
          <p className="dash-ai-hero-headline">{analysis.headline}</p>
          {analysis.subline ? <p className="dash-ai-hero-subline">{analysis.subline}</p> : null}
        </div>

        {(analysis.chips || []).length > 0 && (
          <div className="dash-ai-chips">
            {analysis.chips.map((chip) => (
              <div key={chip.label} className="dash-ai-chip">
                <span className="dash-ai-chip-label">{chip.label}</span>
                <span className="dash-ai-chip-value">{chip.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="dash-ai-focus">
          <span className="dash-ai-focus-title">{analysis.focusTitle}</span>
          <span className="dash-ai-focus-detail">{analysis.focusDetail}</span>
        </div>

        {analysis.macroProgress?.length > 0 && (
          <div className="dash-ai-macros">
            <AiMacroMeters rows={analysis.macroProgress} />
          </div>
        )}

        {analysis.recommendationTargets?.canRecommend && (
          <div className="dash-ai-menu-actions">
            <div className="dash-ai-venue-row">
              {VENUE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`dash-ai-venue-chip${menuVenueMode === mode.id ? " is-active" : ""}`}
                  onClick={() => handleMenuVenueModeChange(mode.id)}
                >
                  {mode.icon} {mode.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`dash-ai-primary-btn dash-ai-primary-btn--${analysis.actionTone || "neutral"}`}
              onClick={handleGenerateMenuRecommendations}
              disabled={menuLoading}
            >
              {menuLoading ? "กำลังคำนวณ..." : analysis.action}
            </button>
          </div>
        )}

        {showMenuRecommendations && (
          <div className="dash-ai-menu-list nutri-menu-card-grid">
            <MenuRecommendationPrefs
              preferences={user?.foodPreferences}
              onShuffle={handleMenuPreferenceAction}
              disabled={menuLoading}
            />
            {menuLoading && <p className="dash-ai-menu-loading">กำลังคำนวณเมนู...</p>}
            {!menuLoading && menuRecommendations.length === 0 && (
              <p className="dash-ai-menu-empty">ไม่พบเมนูในช่วงนี้ — ลองเปลี่ยนโหมดหรือลดรายการไม่ชอบ</p>
            )}
            {!menuLoading && menuRecommendations.map((menu, index) => (
              <MenuRecommendationCard
                key={`${menu.id || menu.name}-${index}`}
                menu={menu}
                index={index}
                mealLabel={activeMealTab.replace("มื้อ", "")}
                onSelect={handleAddRecommendedMenu}
                onDislike={handleDislikeRecommendedMenu}
                loading={menuLoading}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          className="dash-ai-tools-toggle"
          onClick={() => setShowAdvancedTools((open) => !open)}
          aria-expanded={showAdvancedTools}
        >
          {showAdvancedTools ? "− ซ่อนเครื่องมือเพิ่มเติม" : "+ จำลองมื้อ / กิจกรรมแนะนำ"}
        </button>

        {showAdvancedTools && (
          <div className="dash-ai-tools-panel">
            <WhatIfFoodSimulator
              totalEaten={totalEaten}
              macros={macros}
              recommendationTargets={analysis.recommendationTargets}
              onTryFood={handleWhatIfSelectFood}
              onTrySwap={handleWhatIfSelectFood}
            />

            {activitySuggestion.show && (
              <div className="dash-ai-activity-card">
                <p className="dash-ai-activity-title">{activitySuggestion.headline}</p>
                <p className="dash-ai-activity-meta">
                  {activitySuggestion.activity.name} · {activitySuggestion.durationMinutes} น. · ~{activitySuggestion.burnCalories} kcal
                </p>
                <button type="button" className="dash-ai-activity-btn" onClick={handleLogSuggestedActivity}>
                  บันทึกกิจกรรม
                </button>
              </div>
            )}
          </div>
        )}
      </DashCollapsible>
      </div>
      )}

      {pendingFood && (
        <FoodPortionModal
          food={pendingFood}
          mealPeriod={activeMealTab}
          foodPreferences={user?.foodPreferences}
          onClose={() => setPendingFood(null)}
          onConfirm={handleConfirmFood}
        />
      )}
    </div>
  );
}
