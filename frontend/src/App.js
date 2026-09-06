import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdOutlineSpaceDashboard, MdHistory, MdRestaurant, MdMenuBook, MdDirectionsRun, MdWavingHand, MdHelpOutline } from "react-icons/md";
import { calculateHealthData } from "./utils/healthCalculations";
import { applyTheme, getStoredAppearance, getStoredCustomPrimary, getStoredFollowDevice, getStoredThemeId, persistThemeSettings, subscribeSystemAppearance, unsubscribeSystemAppearance } from "./utils/applyTheme";
import { applyDailyArchive } from "./utils/applyDailyArchive";
import { styles } from "./styles/appStyles";
import AppVisualEffects from "./components/layout/AppVisualEffects";
import Sidebar from "./components/layout/Sidebar";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import HistoryPage from "./components/history/HistoryPage";
import ProfilePage from "./components/profile/ProfilePage";
import AppPageHint from "./components/ui/AppPageHint";
import UserGuideModal from "./components/ui/UserGuideModal";
import FoodPreferencesModal from "./components/ui/FoodPreferencesModal";
import DailyCompleteToast from "./components/ui/DailyCompleteToast";
import { useDailyMealCompleteCelebration } from "./hooks/useDailyMealCompleteCelebration";
import { PAGE_META } from "./constants/pageMeta";
import { EMPTY_MEALS, loadUserSession, saveUserSession, clearLegacySessionKeys } from "./utils/userStorage";
import { stripSimulatedHistory } from "./utils/dailyArchive";
import { hasSeenUserGuide, markUserGuideSeen } from "./utils/userGuideStorage";
import {
  hasCompletedFoodPrefsSetup,
  markFoodPrefsSetupDone,
} from "./utils/foodPreferencesStorage";
import {
  EMPTY_FOOD_PREFERENCES,
  hasFoodAvoidanceConfigured,
  normalizeFoodPreferences,
} from "./utils/foodPreferences";
import { formatTodayLabel } from "./utils/logDisplay";

const TAB_ICONS = {
  dashboard: MdOutlineSpaceDashboard,
  food: MdRestaurant,
  meals: MdMenuBook,
  activity: MdDirectionsRun,
  history: MdHistory,
  profile: HiOutlineUserCircle,
};

const getUserInitials = (username) => {
  const clean = String(username || "").trim();
  if (!clean) return "?";
  return clean.slice(0, 2).toUpperCase();
};

const FoodLogPage = lazy(() => import("./components/dashboard/FoodLogPage"));
const ActivityLogPage = lazy(() => import("./components/dashboard/ActivityLogPage"));

function TabLoading() {
  return <div style={{ padding: 24, color: "#64748b" }}>กำลังโหลด...</div>;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [themeId, setThemeId] = useState(getStoredThemeId);
  const [appearanceMode, setAppearanceMode] = useState(getStoredAppearance);
  const [followDevice, setFollowDevice] = useState(getStoredFollowDevice);
  const [customPrimary, setCustomPrimary] = useState(getStoredCustomPrimary);

  useEffect(() => {
    applyTheme({ themeId, appearanceMode, followDevice, customPrimary });
    persistThemeSettings({ themeId, appearanceMode, followDevice, customPrimary });
  }, [themeId, appearanceMode, followDevice, customPrimary]);

  useEffect(() => {
    subscribeSystemAppearance(() => {
      applyTheme({ themeId, appearanceMode, followDevice, customPrimary });
    });
    return unsubscribeSystemAppearance;
  }, [themeId, appearanceMode, followDevice, customPrimary]);

  const [user, setUser] = useState(null);
  const [dailyMeals, setDailyMeals] = useState(() => ({ ...EMPTY_MEALS }));
  const [historyData, setHistoryData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeMealTab, setActiveMealTab] = useState("มื้อเช้า");
  const [activityLaunchPreset, setActivityLaunchPreset] = useState(null);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showFoodPrefsModal, setShowFoodPrefsModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return;
    setHistoryData((prev) => {
      const cleaned = stripSimulatedHistory(prev);
      return cleaned.length === prev.length ? prev : cleaned;
    });
  }, [isLoggedIn, user?.username]);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return;
    saveUserSession(user.username, { user, dailyMeals, historyData, activities });
  }, [isLoggedIn, user, dailyMeals, activities, historyData]);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return;
    if (showFoodPrefsModal) return;
    if (!hasSeenUserGuide(user.username)) {
      setShowUserGuide(true);
    }
  }, [isLoggedIn, user?.username, showFoodPrefsModal]);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return;
    if (hasCompletedFoodPrefsSetup(user.username)) return;
    if (hasFoodAvoidanceConfigured(user.foodPreferences)) {
      markFoodPrefsSetupDone(user.username);
      return;
    }
    setShowFoodPrefsModal(true);
  }, [isLoggedIn, user?.username, user?.foodPreferences]);

  const handleCloseUserGuide = () => {
    if (user?.username) markUserGuideSeen(user.username);
    setShowUserGuide(false);
  };

  const handleLogin = (userData) => {
    const username = userData.username?.trim();
    if (!username) return;

    const session = loadUserSession(username);
    const sessionPrefs = normalizeFoodPreferences(session.user?.foodPreferences);
    const incomingPrefs = normalizeFoodPreferences(userData.foodPreferences);
    const foodPreferences = hasFoodAvoidanceConfigured(incomingPrefs)
      ? incomingPrefs
      : (hasFoodAvoidanceConfigured(sessionPrefs) ? sessionPrefs : incomingPrefs);

    const mergedUser = {
      ...(session.user || {}),
      ...userData,
      username,
      foodPreferences,
    };
    delete mergedUser.foodPrefsConfiguredOnSignup;

    const archived = applyDailyArchive({
      lastDate: session.lastDate,
      user: mergedUser,
      dailyMeals: session.dailyMeals,
      historyData: stripSimulatedHistory(session.historyData),
      activities: session.activities,
    });

    setUser(archived.user);
    setDailyMeals(archived.dailyMeals);
    setHistoryData(stripSimulatedHistory(archived.historyData));
    setActivities(archived.activities);
    saveUserSession(username, {
      ...archived,
      historyData: stripSimulatedHistory(archived.historyData),
    });
    clearLegacySessionKeys();
    if (userData.foodPrefsConfiguredOnSignup || hasFoodAvoidanceConfigured(mergedUser.foodPreferences)) {
      markFoodPrefsSetupDone(username);
    }
    setIsLoggedIn(true);
    setCurrentTab("dashboard");
  };

  const handleSaveFoodPreferences = (nextPreferences) => {
    setUser((prev) => ({ ...prev, foodPreferences: normalizeFoodPreferences(nextPreferences) }));
    if (user?.username) markFoodPrefsSetupDone(user.username);
    setShowFoodPrefsModal(false);
  };

  const handleSkipFoodPreferences = () => {
    if (user?.username) markFoodPrefsSetupDone(user.username);
    setShowFoodPrefsModal(false);
  };

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      if (user?.username) {
        saveUserSession(user.username, { user, dailyMeals, historyData, activities });
      }
      setIsLoggedIn(false);
      setCurrentTab("dashboard");
      setUser(null);
      setDailyMeals({ ...EMPTY_MEALS });
      setHistoryData([]);
      setActivities([]);
    }
  };

  const tdee = user ? calculateHealthData(user).tdee : 0;
  const { toast: completeToast, dismissToast } = useDailyMealCompleteCelebration(
    dailyMeals,
    user?.username,
    tdee,
  );

  const headerFoodCals = Object.values(dailyMeals || {}).flat().reduce(
    (sum, item) => sum + (Number(item?.calories) || 0),
    0,
  );
  const headerActivityCals = (activities || []).reduce(
    (sum, item) => sum + (Number(item.calories) || 0),
    0,
  );
  const headerNetCals = headerFoodCals - headerActivityCals;

  if (!isLoggedIn) {
    return (
      <>
        <DailyCompleteToast payload={completeToast} onClose={dismissToast} />
        <AuthPage
        onLogin={handleLogin}
        themeId={themeId}
        appearanceMode={appearanceMode}
        followDevice={followDevice}
        customPrimary={customPrimary}
        onThemeChange={setThemeId}
        onAppearanceChange={setAppearanceMode}
        onFollowDeviceChange={setFollowDevice}
        onCustomPrimaryChange={setCustomPrimary}
      />
      </>
    );
  }

  const { tdee: latestTDEE } = calculateHealthData(user);
  const normalizedFoodPreferences = normalizeFoodPreferences(user?.foodPreferences);
  const updatedUser = {
    ...user,
    tdee: latestTDEE,
    foodPreferences: normalizedFoodPreferences,
  };

  const removeMeal = (mealType, index) => {
    const updated = [...dailyMeals[mealType]];
    updated.splice(index, 1);
    setDailyMeals({ ...dailyMeals, [mealType]: updated });
  };

  const handleNavigateToFood = () => setCurrentTab("food");

  const handleNavigateToDashboard = () => setCurrentTab("dashboard");

  const handleNavigateToActivity = (preset) => {
    if (preset) setActivityLaunchPreset(preset);
    setCurrentTab("activity");
  };

  const handleNavigateToMeals = () => setCurrentTab("meals");

  const pageMeta = PAGE_META[currentTab] || PAGE_META.dashboard;
  const PageIcon = TAB_ICONS[currentTab] || TAB_ICONS.dashboard;
  const dashboardViewMode = currentTab === "meals" ? "meals" : "home";
  const todayLabel = formatTodayLabel();
  const hasAnyLogHistory =
    historyData.length > 0
    || Object.values(dailyMeals).some((meal) => meal.length > 0)
    || activities.length > 0;
  const isFirstTimeUser = !hasAnyLogHistory;

  return (
    <Router>
      <AppVisualEffects />
      <DailyCompleteToast payload={completeToast} onClose={dismissToast} />
      <FoodPreferencesModal
        open={showFoodPrefsModal}
        initialPreferences={user?.foodPreferences}
        onSave={handleSaveFoodPreferences}
        onSkip={handleSkipFoodPreferences}
      />
      <UserGuideModal
        open={showUserGuide}
        onClose={handleCloseUserGuide}
        onStartFood={() => {
          handleCloseUserGuide();
          handleNavigateToFood();
        }}
        onStartActivity={() => {
          handleCloseUserGuide();
          handleNavigateToActivity();
        }}
        onStartMeals={() => {
          handleCloseUserGuide();
          handleNavigateToMeals();
        }}
      />
      <div style={styles.container}>
        <Sidebar
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
          onLogout={handleLogout}
          onOpenGuide={() => setShowUserGuide(true)}
        />
        <main
          className={`app-main nutri-page-bg app-main-tab-${currentTab}`}
          style={styles.mainArea}
        >
          <header className="app-header app-header-context" style={styles.header}>
            <div className="app-header-text">
              <div className="app-header-title-row">
                <span className="app-header-page-icon" aria-hidden>
                  <PageIcon size={22} />
                </span>
                <h1 className="app-header-page-title">{pageMeta.title}</h1>
              </div>
              <p className="app-header-page-tagline">{pageMeta.tagline}</p>
            </div>
            <div className="app-header-meta">
              <span className="app-header-chip app-header-chip--date">{todayLabel}</span>
              {!isFirstTimeUser && (
                <>
                  <span className="app-header-chip">TDEE {updatedUser.tdee || 0} kcal</span>
                  <span className="app-header-chip app-header-chip--accent">
                    กินสุทธิ {headerNetCals} kcal
                  </span>
                </>
              )}
              <button
                type="button"
                className="app-header-help-btn"
                onClick={() => setShowUserGuide(true)}
                aria-label="วิธีใช้งาน"
              >
                <MdHelpOutline size={18} aria-hidden />
                <span>วิธีใช้</span>
              </button>
            </div>
            <div className="app-header-user app-header-user-card">
              <span className="app-header-avatar">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="app-header-avatar-img" />
                ) : (
                  getUserInitials(user.username)
                )}
              </span>
              <span className="app-header-user-text">
                <strong>{user.username}</strong>
                <small>
                  {isFirstTimeUser ? "เริ่มจากแท็บ「อาหาร」" : "ยินดีต้อนรับกลับ"}
                </small>
              </span>
              <MdWavingHand className="app-header-wave" aria-hidden />
            </div>
          </header>
          <AppPageHint text={pageMeta.hint} />
          <div className="app-scroll" style={styles.scrollContent}>
            <Suspense fallback={<TabLoading />}>
            {(currentTab === "dashboard" || currentTab === "meals") && (
              <Dashboard
                user={updatedUser}
                setUser={setUser}
                dailyMeals={dailyMeals}
                setDailyMeals={setDailyMeals}
                activities={activities}
                activeMealTab={activeMealTab}
                onNavigateToFood={handleNavigateToFood}
                onNavigateToActivity={handleNavigateToActivity}
                onNavigateToMeals={handleNavigateToMeals}
                onOpenGuide={() => setShowUserGuide(true)}
                viewMode={dashboardViewMode}
              />
            )}
            {currentTab === "food" && (
              <FoodLogPage
                tdee={updatedUser.tdee}
                user={updatedUser}
                dailyMeals={dailyMeals}
                setDailyMeals={setDailyMeals}
                activeMealTab={activeMealTab}
                setActiveMealTab={setActiveMealTab}
                onRemoveMeal={removeMeal}
                activities={activities}
                onNavigateToDashboard={handleNavigateToDashboard}
                onNavigateToMeals={handleNavigateToMeals}
              />
            )}
            {currentTab === "activity" && (
              <ActivityLogPage
                user={updatedUser}
                activities={activities}
                setActivities={setActivities}
                activeMealTab={activeMealTab}
                setActiveMealTab={setActiveMealTab}
                launchPreset={activityLaunchPreset}
                onLaunchPresetConsumed={() => setActivityLaunchPreset(null)}
                onNavigateToDashboard={handleNavigateToDashboard}
              />
            )}
            {currentTab === "history" && (
              <HistoryPage
                historyData={historyData}
                dailyMeals={dailyMeals}
                activities={activities}
                userWeight={user.weight}
                userTdee={user.tdee}
              />
            )}
            {currentTab === "profile" && (
              <ProfilePage
                user={user}
                setUser={setUser}
                historyData={historyData}
                dailyMeals={dailyMeals}
                activities={activities}
                onLogout={handleLogout}
                onOpenGuide={() => setShowUserGuide(true)}
              />
            )}
            </Suspense>
          </div>
        </main>
      </div>
    </Router>
  );
}
