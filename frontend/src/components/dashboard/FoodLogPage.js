import React, { useState } from "react";
import { HiPlus, HiSearch, HiAdjustments } from "react-icons/hi";
import { getApiBaseUrl } from "../../constants/config";
import { THAI_DRINK_QUICK_PICKS, THAI_FOOD_QUICK_PICKS, THAI_FRUIT_QUICK_PICKS } from "../../constants/pageMeta";
import { canEstimateCustomFood, canSaveFoodEntry, estimateCustomFood, getEstimateSourceLabel, prepareCustomFoodEstimate, searchThaiFoods } from "../../utils/foodEstimator";
import {
  filterFoodResults,
  tagSearchResults,
} from "../../utils/logSearchHelpers";
import {
  MEAL_ORDER,
  mealTotalsFromDaily,
  stampLogMeta,
  sumCalories,
} from "../../utils/logDisplay";
import { useIsMobile } from "../../hooks/useIsMobile";
import { analyzeThreeMealsSummary, buildActiveMealAdviceView } from "../../utils/mealRecommendations";
import { getProfessionalPrediction } from "../../utils/aiPrediction";
import { generateMenuRecommendations } from "../../utils/menuRecommendations";
import { calculateMacros } from "../../utils/healthCalculations";
import { getMatchingAvoidanceKeywords } from "../../utils/foodPreferences";
import { scoreMealReward, summarizeDailyRewards } from "../../utils/mealRewards";
import { styles } from "../../styles/appStyles";
import QuickStartSteps from "../ui/QuickStartSteps";
import { FOOD_LOG_QUICK_STEPS } from "../../constants/quickStartSteps";
import FoodPortionModal from "../ui/FoodPortionModal";
import LogPageSummary from "../ui/LogPageSummary";
import LogSavedBar from "../ui/LogSavedBar";
import PostSaveMenuSuggestions from "../ui/PostSaveMenuSuggestions";
import FoodFilterSheet, { applyFoodFilters } from "../ui/FoodFilterSheet";
import {
  ActiveMealAdvicePanel,
  EmptyLogHint,
  FoodLogRow,
  IncompleteMealsNotice,
  LogListHeader,
  MealLogSection,
  MealTabStars,
} from "../ui/DailyLogDisplay";

export default function FoodLogPage({
  tdee,
  user,
  dailyMeals,
  setDailyMeals,
  activeMealTab,
  setActiveMealTab,
  onRemoveMeal,
  activities = [],
  onNavigateToDashboard,
  onNavigateToMeals,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customPreview, setCustomPreview] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [pendingFood, setPendingFood] = useState(null);
  const [showAllDayRecords, setShowAllDayRecords] = useState(false);
  const [saveNotice, setSaveNotice] = useState(null);
  const [mealSuggestions, setMealSuggestions] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    meal: activeMealTab,
    maxKcal: "all",
    giLevel: "all",
  });
  const searchRequestRef = React.useRef(0);
  const recordsRef = React.useRef(null);
  const suggestionsRef = React.useRef(null);
  const searchInputRef = React.useRef(null);
  const [showMoreQuickPicks, setShowMoreQuickPicks] = useState(false);
  const isMobile = useIsMobile();

  const trimmedQuery = searchTerm.trim();
  const visibleSearchList = trimmedQuery ? searchList : [];
  const filteredSearchList = applyFoodFilters(visibleSearchList, filters);
  const hasStrongMatch = visibleSearchList.some((item) => {
    const name = String(item.name || "").trim().toLowerCase();
    const query = trimmedQuery.toLowerCase();
    if (name === query) return true;
    if (query.length >= 2 && name.includes(query)) return true;
    return false;
  });
  const shouldOfferAiEstimate =
    trimmedQuery.length >= 2 && !isSearching && !hasStrongMatch;
  const canAddCustomFood = canEstimateCustomFood(customPreview, trimmedQuery);

  const mealTotals = mealTotalsFromDaily(dailyMeals);
  const foodCals = sumCalories(Object.values(dailyMeals).flat());
  const activityCals = (activities || []).reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  const mealsAnalysis = analyzeThreeMealsSummary(dailyMeals, { tdee, activityCals, activities });
  const dailyRewards = summarizeDailyRewards(mealsAnalysis.perMeal);

  const getMealReward = (mealType) => {
    const analysis = mealsAnalysis.perMeal[mealType];
    return analysis ? scoreMealReward(analysis) : null;
  };

  const activeMealAdvice = buildActiveMealAdviceView(
    activeMealTab,
    mealsAnalysis.perMeal[activeMealTab],
    getMealReward(activeMealTab),
    mealsAnalysis.overall,
    tdee,
  );

  const recordsPreview = foodCals === 0
    ? "ยังไม่มีรายการ"
    : showAllDayRecords
      ? `ทั้งวัน ${foodCals} kcal`
      : `${activeMealTab.replace("มื้อ", "")} ${mealTotals[activeMealTab] || 0} kcal`;

  React.useEffect(() => {
    if (mealSuggestions?.loading || !mealSuggestions?.menus?.length) return;
    window.requestAnimationFrame(() => {
      suggestionsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [mealSuggestions]);

  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, meal: activeMealTab }));
  }, [activeMealTab]);


  React.useEffect(() => {
    if (!isMobile) return undefined;
    const timer = window.setTimeout(() => focusSearch(), 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- โฟกus เมื่อเปิดแท็บบนมือถือ
  }, [isMobile]);

  React.useEffect(() => {
    if (!isMobile || !trimmedQuery) return undefined;
    const timer = window.setTimeout(() => {
      searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [isMobile, trimmedQuery]);

  const handleFilterClose = () => {
    if (filters.meal && filters.meal !== activeMealTab) {
      setActiveMealTab(filters.meal);
    }
    setFilterOpen(false);
  };

  const focusSearch = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const renderSearchPanel = () => (
    <section
      className={`log-page-block log-page-block-search log-panel log-panel-search log-search-panel-pro${trimmedQuery ? " is-search-active" : ""}`}
      style={styles.card}
    >
      <div className="log-search-hero">
        <label htmlFor="food-search-input" className="log-search-hero-label">
          ค้นหาอาหาร · {activeMealTab.replace("มื้อ", "")}
        </label>
        <div className="log-search-hero-row">
          <div className="log-search-hero-input-wrap">
            <HiSearch className="log-search-hero-icon" aria-hidden />
            <input
              id="food-search-input"
              ref={searchInputRef}
              className="log-search-hero-input"
              placeholder="ค้นหาอาหาร เช่น ข้าวกะเพราไก่"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                searchRequestRef.current += 1;
                setSearchList([]);
                setCustomPreview(null);
                setIsSearching(Boolean(value.trim()));
              }}
              onKeyDown={handleSearchKeyDown}
              aria-label="ค้นหาอาหาร"
            />
          </div>
          <button
            type="button"
            className="log-search-filter-btn"
            onClick={() => setFilterOpen(true)}
            aria-label="เปิดตัวกรอง"
          >
            <HiAdjustments aria-hidden />
            <span>ตัวกรอง</span>
          </button>
        </div>
      </div>

      {trimmedQuery ? (
        <div className="log-search-panel log-search-panel--live">
          <div style={styles.searchResultContainer} className="log-search-results log-search-results--live">
            {isSearching ? (
              <div className="log-search-status">กำลังค้นหา...</div>
            ) : null}
            {filteredSearchList.map((item, i) => {
              const avoidanceKeywords = getMatchingAvoidanceKeywords(item.name, user?.foodPreferences);
              return (
                <button
                  key={item.id || item.name || i}
                  type="button"
                  className={`log-search-item log-search-item-card${avoidanceKeywords.length ? " has-avoidance" : ""}`}
                  style={styles.searchItem}
                  onClick={() => setPendingFood(item)}
                >
                  <div className="log-search-item-main">
                    <b>
                      {avoidanceKeywords.length > 0 ? (
                        <span className="log-search-allergy-badge">แพ้</span>
                      ) : null}
                      {item.name}
                    </b>
                    <small>
                      {item.calories} kcal
                      {item.protein ? ` · P ${item.protein}g` : ""}
                      {avoidanceKeywords.length > 0 ? ` · มี${avoidanceKeywords.join(", ")}` : ""}
                      {item._searchScore != null
                        && item._searchScore < 0.95
                        && !String(item.name || "").toLowerCase().includes(trimmedQuery.toLowerCase())
                        ? " · ใกล้เคียง"
                        : ""}
                    </small>
                  </div>
                  <span className="log-search-add" style={styles.btnAdd}><HiPlus /></span>
                </button>
              );
            })}
            {!isSearching && filteredSearchList.length === 0 && visibleSearchList.length > 0 && (
              <div className="log-search-status">ไม่พบเมนูตามตัวกรอง — ลองปรับตัวกรอง</div>
            )}
            {!isSearching && visibleSearchList.length === 0 && !shouldOfferAiEstimate && (
              <div className="log-search-status">ไม่พบเมนูในฐานข้อมูล</div>
            )}
          </div>

          {shouldOfferAiEstimate && (
            <div className="log-search-ai-panel">
              {visibleSearchList.length > 0 && (
                <p className="log-search-custom-hint">ไม่ใช่เมนูด้านบน? ใช้ AI ประเมินแทน</p>
              )}
              {isEstimating ? (
                <div className="log-search-status log-search-status--ai">AI กำลังประเมิน &ldquo;{trimmedQuery}&rdquo;...</div>
              ) : (
                <button
                  type="button"
                  className="log-search-ai-btn"
                  onClick={handleAddCustomFromSearch}
                >
                  <span className="log-search-ai-btn-main">+ AI ประเมิน &ldquo;{trimmedQuery}&rdquo;</span>
                  <span className="log-search-ai-btn-sub">
                    {canAddCustomFood && customPreview
                      ? `${customPreview.calories} kcal · ${getEstimateSourceLabel(customPreview.estimateSource)} · กดเลือกปริมาณ`
                      : "กดเพื่อคำนวณแคลและบันทึก"}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="log-quick-picks-hint">แตะเมนูยอดนิยม หรือพิมพ์ชื่ออาหารด้านบน</p>
          <div className="log-quick-picks log-quick-picks--food">
            {THAI_FOOD_QUICK_PICKS.map((name) => (
              <button key={name} type="button" className="log-quick-pick" onClick={() => applyQuickPick(name)}>
                {name}
              </button>
            ))}
          </div>
          {(!isMobile || showMoreQuickPicks) && (
            <>
              <div className="log-quick-picks log-quick-picks--fruits">
                <span className="log-quick-picks-label">ผลไม้</span>
                {THAI_FRUIT_QUICK_PICKS.map((name) => (
                  <button key={name} type="button" className="log-quick-pick log-quick-pick--fruit" onClick={() => applyQuickPick(name)}>
                    {name}
                  </button>
                ))}
              </div>
              <div className="log-quick-picks log-quick-picks--drinks">
                <span className="log-quick-picks-label">เครื่องดื่ม</span>
                {THAI_DRINK_QUICK_PICKS.map((name) => (
                  <button key={name} type="button" className="log-quick-pick log-quick-pick--drink" onClick={() => applyQuickPick(name)}>
                    {name}
                  </button>
                ))}
              </div>
            </>
          )}
          {isMobile && !showMoreQuickPicks ? (
            <button
              type="button"
              className="log-quick-picks-more"
              onClick={() => setShowMoreQuickPicks(true)}
            >
              + ผลไม้ / เครื่องดื่ม
            </button>
          ) : null}
        </>
      )}
    </section>
  );

  const scrollToRecords = () => {
    window.requestAnimationFrame(() => {
      recordsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const loadMealSuggestions = React.useCallback(async (meals) => {
    const nextFoodCals = sumCalories(Object.values(meals).flat());
    const nextActivityCals = (activities || []).reduce(
      (sum, item) => sum + (Number(item.calories) || 0),
      0,
    );
    const totalEaten = Object.values(meals).flat().reduce(
      (acc, food) => ({
        p: acc.p + (Number(food.protein) || 0),
        c: acc.c + (Number(food.carbs) || 0),
        f: acc.f + (Number(food.fat) || 0),
        cal: acc.cal + (Number(food.calories) || 0),
      }),
      { p: 0, c: 0, f: 0, cal: 0 },
    );
    const macros = calculateMacros(tdee);
    const analysis = getProfessionalPrediction({
      tdee,
      foodCals: nextFoodCals,
      activityCals: nextActivityCals,
      macros,
      totalEaten,
    });

    if (!analysis.recommendationTargets?.canRecommend) {
      setMealSuggestions({
        loading: false,
        headline: analysis.headline,
        focusDetail: analysis.focusDetail,
        calRange: "",
        menus: [],
      });
      return;
    }

    setMealSuggestions({
      loading: true,
      headline: analysis.subline || analysis.headline,
      focusDetail: analysis.focusDetail,
      calRange: `${analysis.recommendationTargets.calMin}–${analysis.recommendationTargets.calMax}`,
      menus: [],
    });

    try {
      const menus = await generateMenuRecommendations(
        {
          ...analysis.recommendationTargets,
          foodPreferences: user?.foodPreferences,
          shuffleMenus: false,
        },
        "home",
      );
      setMealSuggestions({
        loading: false,
        headline: analysis.subline || analysis.headline,
        focusDetail: analysis.focusTitle ? `${analysis.focusTitle} — ${analysis.focusDetail}` : analysis.focusDetail,
        calRange: `${analysis.recommendationTargets.calMin}–${analysis.recommendationTargets.calMax}`,
        menus: menus.slice(0, 3),
      });
    } catch (error) {
      console.error("Post-save menu suggestions:", error);
      setMealSuggestions({
        loading: false,
        headline: analysis.headline,
        focusDetail: analysis.focusDetail,
        calRange: "",
        menus: [],
      });
    }
  }, [activities, tdee, user?.foodPreferences]);

  React.useEffect(() => {
    const requestId = ++searchRequestRef.current;
    const query = searchTerm.trim();
    const isStale = () => requestId !== searchRequestRef.current;

    if (!query) {
      setSearchList([]);
      setCustomPreview(null);
      setIsSearching(false);
      return undefined;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/foods/search?q=${encodeURIComponent(query)}`);
        const data = res.ok ? await res.json() : [];
        if (isStale()) return;
        const apiResults = filterFoodResults(data, query);
        const results = apiResults.length > 0 ? apiResults : filterFoodResults(await searchThaiFoods(query), query);
        setSearchList(tagSearchResults(results, "food"));
      } catch (err) {
        console.error("API Error:", err);
        if (!isStale()) {
          setSearchList(tagSearchResults(filterFoodResults(await searchThaiFoods(query), query), "food"));
        }
      } finally {
        if (!isStale()) setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  React.useEffect(() => {
    if (!shouldOfferAiEstimate) {
      setCustomPreview(null);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setIsEstimating(true);
      try {
        setCustomPreview(await estimateCustomFood(trimmedQuery));
      } finally {
        setIsEstimating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [shouldOfferAiEstimate, trimmedQuery]);

  const handleConfirmFood = (foodEntry) => {
    if (!canSaveFoodEntry(foodEntry)) {
      alert("ไม่สามารถคำนวนเมนูอาหารนี้ได้");
      return;
    }
    const nextMeals = {
      ...dailyMeals,
      [activeMealTab]: [...dailyMeals[activeMealTab], stampLogMeta(foodEntry, activeMealTab)],
    };
    setDailyMeals(nextMeals);
    setSearchTerm("");
    setSearchList([]);
    setPendingFood(null);
    setCustomPreview(null);
    setSaveNotice({
      name: foodEntry.name,
      calories: foodEntry.calories,
    });
    void loadMealSuggestions(nextMeals);
    window.requestAnimationFrame(() => scrollToRecords());
  };

  const handleSelectSuggestedMenu = (menu) => {
    setPendingFood({
      name: menu.name,
      calories: menu.calories,
      protein: menu.protein,
      carbs: menu.carbs,
      fat: menu.fat,
    });
  };

  const handleAddCustomFromSearch = async () => {
    if (!trimmedQuery) {
      alert("กรุณากรอกชื่อเมนู");
      return;
    }
    setIsEstimating(true);
    try {
      const estimated = customPreview || (await estimateCustomFood(trimmedQuery));
      if (!canEstimateCustomFood(estimated, trimmedQuery)) {
        alert("ยังประเมินเมนูนี้ไม่ได้ — ลองเลือกจากรายการค้นหา หรือพิมพ์ชื่อใกล้เคียง");
        return;
      }
      setPendingFood(prepareCustomFoodEstimate(estimated, trimmedQuery));
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key !== "Enter" || !trimmedQuery) return;
    if (hasStrongMatch) return;
    e.preventDefault();
    handleAddCustomFromSearch();
  };

  const applyQuickPick = (name) => {
    setSearchTerm(name);
    searchRequestRef.current += 1;
    setSearchList([]);
    setCustomPreview(null);
    setIsSearching(true);
  };

  const renderRecords = () => {
    if (foodCals === 0) {
      return <EmptyLogHint text="ยังไม่มีอาหาร — เลือกมื้อแล้วค้นหาด้านบน" />;
    }

    const mealsToShow = showAllDayRecords
      ? MEAL_ORDER
      : [activeMealTab];

    return (
      <>
        <div className="log-records-toolbar">
          <button
            type="button"
            className={`log-records-scope-btn${showAllDayRecords ? "" : " is-active"}`}
            onClick={() => setShowAllDayRecords(false)}
          >
            มื้อนี้
          </button>
          <button
            type="button"
            className={`log-records-scope-btn${showAllDayRecords ? " is-active" : ""}`}
            onClick={() => setShowAllDayRecords(true)}
          >
            ทั้งวัน
          </button>
        </div>
        <LogListHeader variant="food" />
        {mealsToShow.map((mealType) => {
          const items = dailyMeals[mealType] || [];
          if (items.length === 0) return null;
          const mealCals = mealTotals[mealType];
          const mealAvoidanceKeywords = [
            ...new Set(
              items.flatMap((item) => getMatchingAvoidanceKeywords(item, user?.foodPreferences)),
            ),
          ];
          return (
            <MealLogSection
              key={mealType}
              mealType={mealType}
              totalCals={mealCals}
              reward={getMealReward(mealType)}
              gi={mealsAnalysis.perMeal[mealType]?.gi}
              avoidanceKeywords={mealAvoidanceKeywords}
            >
              {items.map((item, index) => (
                <FoodLogRow
                  key={`${mealType}-${index}`}
                  item={item}
                  avoidanceKeywords={getMatchingAvoidanceKeywords(item, user?.foodPreferences)}
                  onRemove={() => onRemoveMeal(mealType, index)}
                />
              ))}
            </MealLogSection>
          );
        })}
        {showAllDayRecords && (
          <footer className="log-day-footer">
            <span>รวมทั้งวัน</span>
            <strong>{foodCals} kcal</strong>
          </footer>
        )}
      </>
    );
  };

  return (
    <div className={`log-page log-page-food${foodCals > 0 ? " has-records" : ""}${saveNotice ? " has-save-notice" : ""}${trimmedQuery ? " is-searching" : ""}`}>
      <div className="log-page-block log-page-block-summary">
        <LogPageSummary
          mode="food"
          activeMeal={activeMealTab}
          foodCals={foodCals}
          mealTotals={mealTotals}
          rewards={dailyRewards}
        />
      </div>

      <div className="log-page-block log-page-block-tabs">
        <div className="log-page-meal-tabs meal-tab-row">
          {MEAL_ORDER.map((tab) => {
            const reward = getMealReward(tab);
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveMealTab(tab)}
                className={`log-meal-tab${activeMealTab === tab ? " is-active" : ""}`}
              >
                {tab.replace("มื้อ", "")}
                {mealTotals[tab] > 0 && (
                  <span className="log-meal-tab-cal">{mealTotals[tab]}</span>
                )}
                <MealTabStars stars={reward?.stars} />
              </button>
            );
          })}
        </div>
      </div>

      {foodCals > 0 && (
        <div className="log-page-block log-page-block-records" ref={recordsRef}>
          <section className="log-panel log-panel-records log-panel-records--top" style={styles.card}>
            <header className="log-records-top-head">
              <h3 className="log-records-top-title">รายการที่บันทึก</h3>
              <span className="log-records-top-preview">{recordsPreview}</span>
            </header>
            {renderRecords()}
          </section>
        </div>
      )}

      {(mealSuggestions?.loading || (mealSuggestions?.menus?.length > 0)) && (
        <div className="log-page-block log-page-block-suggestions" ref={suggestionsRef}>
          <PostSaveMenuSuggestions
            headline={mealSuggestions.headline}
            focusDetail={mealSuggestions.focusDetail}
            calRange={mealSuggestions.calRange}
            menus={mealSuggestions.menus}
            loading={mealSuggestions.loading}
            onSelectMenu={handleSelectSuggestedMenu}
            onDismiss={() => setMealSuggestions(null)}
            onViewAllMeals={onNavigateToMeals}
          />
        </div>
      )}

      {renderSearchPanel()}

      {foodCals === 0 && !isMobile && (
        <div className="log-page-block log-page-block-hints">
          <QuickStartSteps
            title="วิธีบันทึกอาหาร"
            steps={FOOD_LOG_QUICK_STEPS}
            primaryLabel="เริ่มค้นหาเมนู"
            onPrimaryAction={focusSearch}
          />
        </div>
      )}

      <div className="log-page-block log-page-block-notice">
        <IncompleteMealsNotice overall={mealsAnalysis.overall} />
      </div>

      <div className="log-page-block log-page-block-advice">
        <ActiveMealAdvicePanel view={activeMealAdvice} mealType={activeMealTab} />
      </div>

      <button type="button" className="log-add-food-fab" onClick={focusSearch} aria-label="เพิ่มอาหาร">
        + เพิ่มอาหาร
      </button>

      <FoodFilterSheet
        open={filterOpen}
        onClose={handleFilterClose}
        filters={filters}
        onChange={setFilters}
      />

      <LogSavedBar
        notice={saveNotice}
        onDismiss={() => setSaveNotice(null)}
        onViewRecords={scrollToRecords}
        onGoHome={() => {
          setSaveNotice(null);
          onNavigateToDashboard?.();
        }}
      />

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
