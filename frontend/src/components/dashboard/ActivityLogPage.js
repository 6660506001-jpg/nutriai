import React, { useEffect, useRef, useState } from "react";
import { HiPlus, HiSearch } from "react-icons/hi";
import { getApiBaseUrl } from "../../constants/config";
import { getActivityQuickPicks, searchActivities } from "../../utils/activityCatalog";
import {
  filterActivityResults,
  mergeActivityResults,
  tagSearchResults,
} from "../../utils/logSearchHelpers";
import {
  MEAL_ORDER,
  getMealShort,
  stampLogMeta,
  sumCalories,
} from "../../utils/logDisplay";
import { styles } from "../../styles/appStyles";
import ActivityLogModal from "../ui/ActivityLogModal";
import DashCollapsible from "../ui/DashCollapsible";
import LogPageSummary from "../ui/LogPageSummary";
import LogSavedBar from "../ui/LogSavedBar";
import QuickStartSteps from "../ui/QuickStartSteps";
import { ACTIVITY_LOG_QUICK_STEPS } from "../../constants/quickStartSteps";
import {
  ActivityLogRow,
  EmptyLogHint,
  LogListHeader,
  MealLogSection,
} from "../ui/DailyLogDisplay";

const QUICK_PICKS = getActivityQuickPicks();

export default function ActivityLogPage({
  user,
  activities,
  setActivities,
  activeMealTab,
  setActiveMealTab,
  launchPreset,
  onLaunchPresetConsumed,
  onNavigateToDashboard,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [pendingActivity, setPendingActivity] = useState(null);
  const [suggestedPreset, setSuggestedPreset] = useState(null);
  const [aiBanner, setAiBanner] = useState(null);
  const [recordsOpen, setRecordsOpen] = useState(() => activities.length > 0);
  const [saveNotice, setSaveNotice] = useState(null);
  const searchRequestRef = useRef(0);
  const recordsRef = useRef(null);
  const searchInputRef = useRef(null);

  const trimmedQuery = searchTerm.trim();
  const visibleSearchList = trimmedQuery ? searchList : [];
  const activityCals = sumCalories(activities);
  const totalMinutes = activities.reduce((sum, a) => sum + (Number(a.durationMinutes) || 0), 0);

  const mealGroups = MEAL_ORDER.map((mealType) => ({
    mealType,
    items: activities.filter((item) => item.mealPeriod === mealType),
  })).filter((group) => group.items.length > 0);

  const recordsPreview = activities.length === 0
    ? "ยังไม่มีกิจกรรม"
    : `−${activityCals} kcal · ${totalMinutes} น. · ${activities.length} รายการ`;

  useEffect(() => {
    if (activities.length > 0) setRecordsOpen(true);
  }, [activities.length]);

  const scrollToRecords = () => {
    setRecordsOpen(true);
    window.requestAnimationFrame(() => {
      recordsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const focusSearch = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const renderSearchPanel = () => (
    <section className="log-page-block log-page-block-search log-panel log-panel-search log-search-panel-pro log-search-panel-pro--activity" style={styles.card}>
      <div className="log-search-hero">
        <label htmlFor="activity-search-input" className="log-search-hero-label">
          ค้นหากิจกรรม · {getMealShort(activeMealTab)}
        </label>
        <div className="log-search-hero-row">
          <div className="log-search-hero-input-wrap">
            <HiSearch className="log-search-hero-icon" aria-hidden />
            <input
              id="activity-search-input"
              ref={searchInputRef}
              className="log-search-hero-input"
              placeholder="ค้นหากิจกรรม เช่น วิ่ง เดิน ปั่นจักรยาน"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (!value.trim()) {
                  searchRequestRef.current += 1;
                  setSearchList([]);
                }
              }}
              aria-label="ค้นหากิจกรรม"
            />
          </div>
        </div>
      </div>
      <div className="log-quick-picks">
        {QUICK_PICKS.map((item) => (
          <button key={item.id} type="button" className="log-quick-pick log-quick-pick--activity" onClick={() => openActivity(item)}>
            {item.name}
          </button>
        ))}
      </div>
      <div style={styles.searchResultContainer} className="log-search-results">
        {visibleSearchList.map((item, i) => (
          <button
            key={item.id || item.name || i}
            type="button"
            className="log-search-item log-search-item-activity log-search-item-card"
            style={styles.searchItem}
            onClick={() => openActivity(item)}
          >
            <div className="log-search-item-main">
              <b>{item.name}</b>
              <small>~{item.calories} kcal / 30 น.</small>
            </div>
            <span className="log-search-add" style={styles.btnAdd}><HiPlus /></span>
          </button>
        ))}
        {!trimmedQuery && (
          <p className="log-search-status">เลือกจากปุ่มด่วนด้านบน หรือพิมพ์ค้นหา</p>
        )}
      </div>
    </section>
  );

  useEffect(() => {
    if (!launchPreset?.activity) return;
    setPendingActivity({ ...launchPreset.activity });
    setSuggestedPreset({
      durationMinutes: launchPreset.durationMinutes,
      intensity: launchPreset.intensity,
    });
    setAiBanner(
      `AI แนะนำ: ${launchPreset.activity.name} ${launchPreset.durationMinutes} นาที — กดบันทึกใน popup`,
    );
    onLaunchPresetConsumed?.();
  }, [launchPreset, onLaunchPresetConsumed]);

  useEffect(() => {
    const requestId = ++searchRequestRef.current;
    const query = searchTerm.trim();
    const isStale = () => requestId !== searchRequestRef.current;

    if (!query) {
      setSearchList([]);
      return undefined;
    }

    const delayDebounce = setTimeout(async () => {
      const localResults = filterActivityResults(searchActivities(query), query);

      try {
        const res = await fetch(`${getApiBaseUrl()}/api/activities/search?q=${encodeURIComponent(query)}`);
        const data = res.ok ? await res.json() : [];
        if (isStale()) return;
        const apiResults = filterActivityResults(data, query);
        setSearchList(tagSearchResults(mergeActivityResults(localResults, apiResults), "activity"));
      } catch (err) {
        console.error("API Error:", err);
        if (!isStale()) setSearchList(tagSearchResults(localResults, "activity"));
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleConfirmActivity = (activityEntry) => {
    setActivities((prev) => [
      ...prev,
      stampLogMeta({ ...activityEntry, mealPeriod: activeMealTab }, activeMealTab),
    ]);
    setSearchTerm("");
    setSearchList([]);
    setPendingActivity(null);
    setSuggestedPreset(null);
    setAiBanner(null);
    setRecordsOpen(true);
    setSaveNotice({
      name: activityEntry.name,
      detail: `−${activityEntry.calories} kcal · ${activityEntry.durationMinutes} น.`,
    });
    window.requestAnimationFrame(() => scrollToRecords());
  };

  const handleRemoveActivity = (index) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const openActivity = (item) => {
    setPendingActivity(item);
    setSuggestedPreset(null);
  };

  const getActivityIndex = (target) => activities.indexOf(target);

  return (
    <div className={`log-page log-page-activity${activities.length > 0 ? " has-records" : ""}`}>
      {aiBanner && (
        <div className="log-ai-banner" role="status">
          <span>{aiBanner}</span>
          <button type="button" className="log-ai-banner-dismiss" onClick={() => setAiBanner(null)}>
            ปิด
          </button>
        </div>
      )}

      <div className="log-page-block log-page-block-summary">
        <LogPageSummary
          mode="activity"
          activeMeal={activeMealTab}
          activityCals={activityCals}
          totalMinutes={totalMinutes}
          activityCount={activities.length}
        />
      </div>

      {activities.length === 0 && (
        <div className="log-page-block log-page-block-hints">
          <QuickStartSteps
            title="วิธีบันทึกกิจกรรม"
            steps={ACTIVITY_LOG_QUICK_STEPS}
            primaryLabel="เริ่มเลือกกิจกรรม"
            onPrimaryAction={focusSearch}
          />
        </div>
      )}

      {renderSearchPanel()}

      <div className="log-page-block log-page-block-tabs">
        <div className="log-page-meal-tabs meal-tab-row">
          {MEAL_ORDER.map((tab) => {
            const tabCals = sumCalories(activities.filter((a) => a.mealPeriod === tab));
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveMealTab(tab)}
                className={`log-meal-tab log-meal-tab-activity${activeMealTab === tab ? " is-active" : ""}`}
              >
                {getMealShort(tab)}
                {tabCals > 0 && <span className="log-meal-tab-cal">−{tabCals}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="log-page-block log-page-block-records" ref={recordsRef}>
        <DashCollapsible
          className="dash-collapse-log-records log-panel-records-wrap"
          title="กิจกรรมที่บันทึก"
          preview={recordsPreview}
          open={recordsOpen}
          onOpenChange={setRecordsOpen}
          collapseOnMobile={false}
          defaultOpen={activities.length > 0}
        >
          <section className="log-panel log-panel-records" style={styles.card}>
            {activities.length === 0 ? (
              <EmptyLogHint text="ยังไม่มีกิจกรรม — เลือกจากปุ่มด่วนหรือค้นหาด้านบน" />
            ) : (
              <>
                <LogListHeader variant="activity" />
                {mealGroups.map(({ mealType, items }) => (
                  <MealLogSection
                    key={mealType}
                    mealType={mealType}
                    totalCals={sumCalories(items)}
                    variant="activity"
                    emptyText="—"
                  >
                    {items.map((item) => (
                      <ActivityLogRow
                        key={`${mealType}-${item.loggedAt}-${item.name}`}
                        item={item}
                        onRemove={() => {
                          const index = getActivityIndex(item);
                          if (index >= 0) handleRemoveActivity(index);
                        }}
                      />
                    ))}
                  </MealLogSection>
                ))}
                <footer className="log-day-footer log-day-footer--activity">
                  <span>รวมทั้งวัน</span>
                  <strong>−{activityCals} kcal · {totalMinutes} น.</strong>
                </footer>
              </>
            )}
          </section>
        </DashCollapsible>
      </div>

      <button type="button" className="log-add-food-fab log-add-activity-fab" onClick={focusSearch} aria-label="เพิ่มกิจกรรม">
        + เพิ่มกิจกรรม
      </button>

      <LogSavedBar
        notice={saveNotice}
        onDismiss={() => setSaveNotice(null)}
        onViewRecords={scrollToRecords}
        onGoHome={() => {
          setSaveNotice(null);
          onNavigateToDashboard?.();
        }}
      />

      {pendingActivity && (
        <ActivityLogModal
          activity={pendingActivity}
          userWeight={user.weight}
          mealPeriod={activeMealTab}
          suggestedDurationMinutes={suggestedPreset?.durationMinutes ?? pendingActivity.defaultDurationMinutes}
          suggestedIntensity={suggestedPreset?.intensity ?? pendingActivity.defaultIntensity}
          onClose={() => {
            setPendingActivity(null);
            setSuggestedPreset(null);
          }}
          onConfirm={handleConfirmActivity}
        />
      )}
    </div>
  );
}
