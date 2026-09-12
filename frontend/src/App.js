import React, { Suspense, lazy, useState, useEffect, useMemo, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdOutlineSpaceDashboard, MdHistory, MdRestaurant, MdMenuBook, MdDirectionsRun, MdWavingHand, MdHelpOutline } from "react-icons/md";
import { calculateHealthData, calculateMacros } from "./utils/healthCalculations";
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
import {
  EMPTY_MEALS,
  loadUserSession,
  saveUserSession,
  clearLegacySessionKeys,
  findStoredUsername,
  clearLastUsername,
} from "./utils/userStorage";
import { loadUserDataFromCloud, saveUserDataToCloud } from "./utils/syncApi";
import SyncUnlockModal from "./components/ui/SyncUnlockModal";
import { clearSyncPassword, getSyncPassword, setSyncPassword } from "./utils/syncCredentials";
import { packCloudPayload, resolveSessionOnLogin, sessionHasLogData } from "./utils/sessionCloudMerge";
import { stripSimulatedHistory } from "./utils/dailyArchive";
import { hasSeenUserGuide, markUserGuideSeen } from "./utils/userGuideStorage";
import {
  hasCompletedFoodPrefsSetup,
  markFoodPrefsSetupDone,
} from "./utils/foodPreferencesStorage";
import {
  hasFoodAvoidanceConfigured,
  normalizeFoodPreferences,
} from "./utils/foodPreferences";
import { formatTodayLabel, getMealPeriodByTime, getTodayKey, MEAL_ORDER } from "./utils/logDisplay";
import { useIsMobile } from "./hooks/useIsMobile";
import DashboardRings from "./components/ui/DashboardRings";

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

function bootstrapLastSession() {
  const username = findStoredUsername();
  if (!username) return null;
  const localSession = loadUserSession(username);
  if (!localSession.user?.username) return null;
  return applyDailyArchive({
    lastDate: localSession.lastDate,
    user: localSession.user,
    dailyMeals: localSession.dailyMeals,
    historyData: stripSimulatedHistory(localSession.historyData),
    activities: localSession.activities,
  });
}

export default function App() {
  const [bootSession] = useState(bootstrapLastSession);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(bootSession?.user));
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

  const [user, setUser] = useState(() => bootSession?.user || null);
  const [dailyMeals, setDailyMeals] = useState(() => bootSession?.dailyMeals || ({ ...EMPTY_MEALS }));
  const [historyData, setHistoryData] = useState(() => bootSession?.historyData || []);
  const [activities, setActivities] = useState(() => bootSession?.activities || []);
  const [activeMealTab, setActiveMealTab] = useState(getMealPeriodByTime);
  const [activityLaunchPreset, setActivityLaunchPreset] = useState(null);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showFoodPrefsModal, setShowFoodPrefsModal] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const [syncUnlockError, setSyncUnlockError] = useState("");
  const [syncUnlockBusy, setSyncUnlockBusy] = useState(false);
  const [syncUnlockHint, setSyncUnlockHint] = useState("");
  const [syncUnlockOpen, setSyncUnlockOpen] = useState(() => {
    const name = bootSession?.user?.username;
    return Boolean(name && !getSyncPassword(name));
  });
  const isMobile = useIsMobile();
  const cloudSyncTimerRef = useRef(null);
  const cloudPullingRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return;
    setHistoryData((prev) => {
      const cleaned = stripSimulatedHistory(prev);
      return cleaned.length === prev.length ? prev : cleaned;
    });
  }, [isLoggedIn, user?.username]);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return;
    saveUserSession(user.username, {
      user,
      dailyMeals,
      historyData,
      activities,
      lastDate: getTodayKey(),
    });
  }, [isLoggedIn, user, dailyMeals, activities, historyData]);

  const applyResolvedCloudSession = (resolved, fallbackUser) => {
    const archived = applyDailyArchive({
      lastDate: resolved.lastDate,
      user: mergeUserProfile(
        fallbackUser.username,
        fallbackUser,
        resolved.user || fallbackUser,
      ),
      dailyMeals: resolved.dailyMeals,
      historyData: stripSimulatedHistory(resolved.historyData),
      activities: resolved.activities,
    });
    setUser(archived.user);
    setDailyMeals(archived.dailyMeals);
    setHistoryData(archived.historyData);
    setActivities(archived.activities);
    saveUserSession(archived.user.username, archived);
    return archived;
  };

  const pullCloudSession = async (username, password, snapshotUser, snapshotLogs) => {
    const cloud = await loadUserDataFromCloud(username, password);
    const localSession = {
      ...loadUserSession(username),
      dailyMeals: snapshotLogs.dailyMeals,
      activities: snapshotLogs.activities,
      historyData: snapshotLogs.historyData,
      user: snapshotUser,
    };
    return resolveSessionOnLogin(localSession, cloud, snapshotUser);
  };

  useEffect(() => {
    if (!isLoggedIn || !user?.username) {
      setCloudReady(false);
      return undefined;
    }

    const password = getSyncPassword(user.username);
    if (!password) {
      setCloudReady(false);
      return undefined;
    }

    let cancelled = false;
    cloudPullingRef.current = true;
    pullCloudSession(user.username, password, user, { dailyMeals, activities, historyData })
      .then(({ session: resolved, uploadLocal }) => {
        if (cancelled || !resolved) return;
        const localHas = sessionHasLogData({ dailyMeals, activities, historyData });
        if (sessionHasLogData(resolved) && (!localHas || !uploadLocal)) {
          applyResolvedCloudSession(resolved, user);
        } else if (uploadLocal && localHas) {
          const { lastDate } = loadUserSession(user.username);
          return saveUserDataToCloud(
            user.username,
            password,
            packCloudPayload({ dailyMeals, activities, historyData, lastDate, user }),
          );
        }
        return undefined;
      })
      .catch(() => {})
      .finally(() => {
        cloudPullingRef.current = false;
        if (!cancelled) setCloudReady(true);
      });

    return () => {
      cancelled = true;
    };
    // Restore from cloud once per login / username, not on every log edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user?.username]);

  useEffect(() => {
    if (!isLoggedIn || !user?.username || !cloudReady) return undefined;
    const password = getSyncPassword(user.username);
    if (!password) return undefined;

    const refresh = () => {
      if (document.visibilityState && document.visibilityState !== "visible") return;
      if (cloudPullingRef.current) return;
      cloudPullingRef.current = true;
      pullCloudSession(user.username, password, user, { dailyMeals, activities, historyData })
        .then(({ session: resolved, uploadLocal }) => {
          if (!resolved) return;
          const localHas = sessionHasLogData({ dailyMeals, activities, historyData });
          if (sessionHasLogData(resolved) && (!localHas || !uploadLocal)) {
            applyResolvedCloudSession(resolved, user);
          }
        })
        .catch(() => {})
        .finally(() => {
          cloudPullingRef.current = false;
        });
    };

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [isLoggedIn, user, dailyMeals, activities, historyData, cloudReady]);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return undefined;
    const password = getSyncPassword(user.username);
    if (!password) return undefined;
    if (!sessionHasLogData({ dailyMeals, activities, historyData })) return undefined;

    if (cloudSyncTimerRef.current) {
      clearTimeout(cloudSyncTimerRef.current);
    }
    cloudSyncTimerRef.current = setTimeout(() => {
      const { lastDate } = loadUserSession(user.username);
      saveUserDataToCloud(
        user.username,
        password,
        packCloudPayload({ dailyMeals, activities, historyData, lastDate, user }),
      ).catch(() => {});
    }, 800);

    return () => {
      if (cloudSyncTimerRef.current) {
        clearTimeout(cloudSyncTimerRef.current);
      }
    };
  }, [isLoggedIn, user, dailyMeals, activities, historyData]);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return;
    if (showFoodPrefsModal) return;
    if (isMobile) return;
    if (!hasSeenUserGuide(user.username)) {
      setShowUserGuide(true);
    }
  }, [isLoggedIn, user?.username, showFoodPrefsModal, isMobile]);

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

  const mergeUserProfile = (username, userData, sessionUser) => {
    const sessionPrefs = normalizeFoodPreferences(sessionUser?.foodPreferences);
    const incomingPrefs = normalizeFoodPreferences(userData.foodPreferences);
    const foodPreferences = hasFoodAvoidanceConfigured(incomingPrefs)
      ? incomingPrefs
      : (hasFoodAvoidanceConfigured(sessionPrefs) ? sessionPrefs : incomingPrefs);

    const mergedUser = {
      ...(sessionUser || {}),
      ...userData,
      username,
      foodPreferences,
    };
    delete mergedUser.foodPrefsConfiguredOnSignup;
    return mergedUser;
  };

  const handleUnlockSync = async (password) => {
    if (!user?.username) return;
    const clean = String(password || "").trim();
    if (!clean) {
      setSyncUnlockError("กรอกรหัสผ่านของบัญชีนี้");
      return;
    }
    setSyncUnlockBusy(true);
    setSyncUnlockError("");
    setSyncUnlockHint("");
    try {
      setSyncPassword(user.username, clean);
      const { session: resolved, uploadLocal } = await pullCloudSession(
        user.username,
        clean,
        user,
        { dailyMeals, activities, historyData },
      );
      const localHas = sessionHasLogData({ dailyMeals, activities, historyData });
      const resolvedHas = resolved && sessionHasLogData(resolved);
      if (resolvedHas && (!localHas || !uploadLocal)) {
        applyResolvedCloudSession(resolved, user);
        setSyncUnlockOpen(false);
      } else if (localHas) {
        const { lastDate } = loadUserSession(user.username);
        await saveUserDataToCloud(
          user.username,
          clean,
          packCloudPayload({ dailyMeals, activities, historyData, lastDate, user }),
        );
        setSyncUnlockOpen(false);
      } else {
        setSyncUnlockHint("ยังไม่มีมื้อบนคลาวด์ — เปิดคอม กรอกรหัสผ่านแล้วกดซิงค์เพื่อส่งมื้อมา แล้วกลับมากดซิงค์บนมือถืออีกครั้ง");
      }
      setCloudReady(true);
    } catch (error) {
      clearSyncPassword(user.username);
      setSyncUnlockError(error?.message || "ซิงค์ไม่สำเร็จ");
    } finally {
      setSyncUnlockBusy(false);
    }
  };

  const handleLogin = async (userData, password = "") => {
    const username = userData.username?.trim();
    if (!username) return;

    if (password) {
      setSyncPassword(username, password);
    }

    const localSession = loadUserSession(username);
    let pickSession = {
      dailyMeals: localSession.dailyMeals,
      activities: localSession.activities,
      historyData: localSession.historyData,
      lastDate: localSession.lastDate,
      user: mergeUserProfile(username, userData, localSession.user),
    };

    if (password) {
      try {
        const cloud = await loadUserDataFromCloud(username, password);
        const { session: resolved, uploadLocal } = resolveSessionOnLogin(
          localSession,
          cloud,
          userData,
        );
        if (resolved) {
          pickSession = {
            dailyMeals: resolved.dailyMeals,
            activities: resolved.activities,
            historyData: resolved.historyData,
            lastDate: resolved.lastDate,
            user: mergeUserProfile(username, userData, resolved.user || localSession.user),
          };
        }
        if (uploadLocal) {
          await saveUserDataToCloud(
            username,
            password,
            packCloudPayload({
              ...localSession,
              user: pickSession.user,
            }),
          );
        }
      } catch {
        if (sessionHasLogData(localSession)) {
          await saveUserDataToCloud(
            username,
            password,
            packCloudPayload({ ...localSession, user: pickSession.user }),
          ).catch(() => {});
        }
      }
    }

    const archived = applyDailyArchive({
      lastDate: pickSession.lastDate,
      user: pickSession.user,
      dailyMeals: pickSession.dailyMeals,
      historyData: stripSimulatedHistory(pickSession.historyData),
      activities: pickSession.activities,
    });

    setUser(archived.user);
    setDailyMeals(archived.dailyMeals);
    setHistoryData(stripSimulatedHistory(archived.historyData));
    setActivities(archived.activities);
    saveUserSession(username, {
      ...archived,
      historyData: stripSimulatedHistory(archived.historyData),
    });
    if (password) {
      saveUserDataToCloud(
        username,
        password,
        packCloudPayload({
          dailyMeals: archived.dailyMeals,
          activities: archived.activities,
          historyData: archived.historyData,
          lastDate: archived.lastDate,
          user: archived.user,
        }),
      ).catch(() => {});
    }
    clearLegacySessionKeys();
    if (userData.foodPrefsConfiguredOnSignup || hasFoodAvoidanceConfigured(archived.user.foodPreferences)) {
      markFoodPrefsSetupDone(username);
    }
    setIsLoggedIn(true);
    setCurrentTab("dashboard");
    if (password) {
      setCloudReady(true);
      setSyncUnlockOpen(false);
    }
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
        const password = getSyncPassword(user.username);
        saveUserSession(user.username, { user, dailyMeals, historyData, activities });
        if (password) {
          saveUserDataToCloud(
            user.username,
            password,
            packCloudPayload({ dailyMeals, activities, historyData, user }),
          ).catch(() => {});
        }
        clearSyncPassword(user.username);
        clearLastUsername();
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
  const headerMacroTotals = useMemo(
    () => Object.values(dailyMeals || {}).flat().reduce(
      (acc, item) => ({
        protein: acc.protein + (Number(item?.protein) || 0),
        carbs: acc.carbs + (Number(item?.carbs) || 0),
        fat: acc.fat + (Number(item?.fat) || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 },
    ),
    [dailyMeals],
  );
  const headerTdee = user ? calculateHealthData(user).tdee : 0;
  const headerMacroTargets = useMemo(
    () => calculateMacros(headerTdee),
    [headerTdee],
  );

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

  const handleNavigateToFood = (mealTab) => {
    if (typeof mealTab === "string" && MEAL_ORDER.includes(mealTab)) {
      setActiveMealTab(mealTab);
    } else {
      setActiveMealTab(getMealPeriodByTime());
    }
    setCurrentTab("food");
  };

  const handleSetTab = (tab) => {
    if (tab === "food" && currentTab !== "food") {
      setActiveMealTab(getMealPeriodByTime());
    }
    if (tab === "activity" && currentTab !== "activity") {
      setActiveMealTab(getMealPeriodByTime());
    }
    setCurrentTab(tab);
  };

  const handleNavigateToDashboard = () => setCurrentTab("dashboard");

  const handleNavigateToActivity = (preset) => {
    if (preset) setActivityLaunchPreset(preset);
    setActiveMealTab(getMealPeriodByTime());
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
  const showDashboardRings = isMobile && currentTab === "dashboard";

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
      {isLoggedIn && user?.username && syncUnlockOpen ? (
        <SyncUnlockModal
          username={user.username}
          hasLocalLogs={sessionHasLogData({ dailyMeals, activities, historyData })}
          busy={syncUnlockBusy}
          error={syncUnlockError}
          hint={syncUnlockHint}
          onSubmit={handleUnlockSync}
          onSkip={() => setSyncUnlockOpen(false)}
        />
      ) : null}
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
          setActiveTab={handleSetTab}
          onLogout={handleLogout}
          onOpenGuide={() => setShowUserGuide(true)}
        />
        <main
          className={`app-main nutri-page-bg app-main-tab-${currentTab}${isMobile ? " app-main--mobile" : ""}`}
          style={styles.mainArea}
        >
          <header
            className={`app-header${showDashboardRings ? " app-header--dash-rings" : " app-header-context"}`}
            style={showDashboardRings ? undefined : styles.header}
          >
            {showDashboardRings ? (
              <>
                <div className="app-header-dash-top">
                  <h1 className="app-header-page-title">{pageMeta.title}</h1>
                  <div className="app-header-dash-top-end">
                    <span className="app-header-avatar app-header-avatar--rings">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="" className="app-header-avatar-img" />
                      ) : (
                        getUserInitials(user.username)
                      )}
                    </span>
                    <button
                      type="button"
                      className="app-header-help-btn app-header-help-btn--icon"
                      onClick={() => setShowUserGuide(true)}
                      aria-label="วิธีใช้งาน"
                    >
                      <MdHelpOutline size={20} aria-hidden />
                    </button>
                  </div>
                </div>
                <DashboardRings
                  foodCals={headerFoodCals}
                  activityCals={headerActivityCals}
                  tdee={updatedUser.tdee}
                  protein={headerMacroTotals.protein}
                  carbs={headerMacroTotals.carbs}
                  fat={headerMacroTotals.fat}
                  targetProtein={headerMacroTargets.protein}
                  targetCarbs={headerMacroTargets.carbs}
                  targetFat={headerMacroTargets.fat}
                  className="app-header-dash-rings"
                />
              </>
            ) : (
              <>
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
                      <span className="app-header-chip">เป้าหมาย {updatedUser.tdee || 0} กิโลแคลอรี</span>
                      <span className="app-header-chip app-header-chip--accent">
                        พลังงานสุทธิ {headerNetCals} กิโลแคลอรี
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
              </>
            )}
          </header>
          {!isMobile ? <AppPageHint text={pageMeta.hint} /> : null}
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
                onNavigateToFood={handleNavigateToFood}
                onNavigateToActivity={() => handleNavigateToActivity()}
              />
            )}
            </Suspense>
          </div>
        </main>
      </div>
    </Router>
  );
}
