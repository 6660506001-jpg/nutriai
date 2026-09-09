import React, { useEffect, useRef, useState } from "react";
import { HiCheckCircle, HiSparkles } from "react-icons/hi";
import { Colors } from "../../constants/colors";
import { styles } from "../../styles/appStyles";
import { loginUser, registerUser } from "../../utils/authApi";
import { canSharePublicAppLink, getApiBaseUrl } from "../../constants/config";
import { EMPTY_FOOD_PREFERENCES, hasFoodAvoidanceConfigured, normalizeFoodPreferences } from "../../utils/foodPreferences";
import FoodAvoidanceEditor from "../ui/FoodAvoidanceEditor";
import AppVisualEffects from "../layout/AppVisualEffects";
import BlurredFoodBackground from "../layout/BlurredFoodBackground";
import LoginVisualEffects from "../layout/LoginVisualEffects";
import LoginField from "../ui/LoginField";
import ThemePicker from "../ui/ThemePicker";
import ShareAccessCard from "../ui/ShareAccessCard";

export default function AuthPage({
  onLogin,
  themeId,
  appearanceMode,
  followDevice,
  customPrimary,
  onThemeChange,
  onAppearanceChange,
  onFollowDeviceChange,
  onCustomPrimaryChange,
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [themePulse, setThemePulse] = useState(false);
  const skipThemePulseRef = useRef(true);
  const [formData, setFormData] = useState({
    username: "", password: "", age: "", weight: "", height: "", gender: "Female"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [foodPreferences, setFoodPreferences] = useState(EMPTY_FOOD_PREFERENCES);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const formRef = useRef(null);
  const submitLockRef = useRef(false);

  useEffect(() => {
    const clearAutofill = () => {
      if (usernameRef.current) usernameRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
    };
    clearAutofill();
    const timer = window.setTimeout(clearAutofill, 100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, username: "", password: "", age: "", weight: "", height: "" }));
    setFoodPreferences(EMPTY_FOOD_PREFERENCES);
    setLoginError("");
    if (usernameRef.current) usernameRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
  }, [isLogin]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${getApiBaseUrl()}/health`, { method: "GET", cache: "no-store" })
      .then((res) => {
        if (!cancelled && !res.ok) {
          setLoginError("เชื่อมต่อ backend ไม่ได้ — ตรวจว่าเปิด uvicorn --host 0.0.0.0 --port 8000");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoginError(
            canSharePublicAppLink()
              ? "เชื่อมต่อ backend ไม่ได้ — ตรวจ REACT_APP_API_BASE_URL บน Vercel"
              : "เชื่อมต่อ backend ไม่ได้ — มือถือต้องอยู่ Wi‑Fi เดียวกับคอม"
          );
        }
      });
    return () => { cancelled = true; };
  }, []);

  const readCredentials = async () => {
    document.activeElement?.blur?.();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const form = formRef.current;
    if (form) {
      const fd = new FormData(form);
      return {
        username: String(fd.get("nutri-auth-user") || "").trim(),
        password: String(fd.get("nutri-auth-password") || ""),
      };
    }
    return {
      username: (usernameRef.current?.value ?? formData.username).trim(),
      password: passwordRef.current?.value ?? formData.password,
    };
  };

  const runSubmit = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (submitLockRef.current || isSubmitting) return;
    submitLockRef.current = true;

    setLoginError("");
    const { username, password } = await readCredentials();

    if (isLogin) {
      if (!username || !password) {
        setLoginError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
        submitLockRef.current = false;
        return;
      }
    } else if (!username || !password || !formData.age || !formData.weight || !formData.height) {
      setLoginError("กรุณากรอกข้อมูลให้ครบถ้วนเพื่อคำนวณแผนสุขภาพ");
      submitLockRef.current = false;
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        const user = await loginUser(username, password);
        onLogin(user);
        return;
      }

      await registerUser({
        username,
        password,
        gender: formData.gender,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
      });

      const user = await loginUser(username, password);
      onLogin({
        ...user,
        foodPreferences: normalizeFoodPreferences(foodPreferences),
        foodPrefsConfiguredOnSignup: hasFoodAvoidanceConfigured(foodPreferences),
      });
    } catch (error) {
      if (error instanceof TypeError) {
        setLoginError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — เปิด backend แล้วลองใหม่");
        return;
      }
      setLoginError(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
      window.setTimeout(() => {
        submitLockRef.current = false;
      }, 400);
    }
  };

  useEffect(() => {
    if (skipThemePulseRef.current) {
      skipThemePulseRef.current = false;
      return undefined;
    }
    setThemePulse(true);
    const timer = setTimeout(() => setThemePulse(false), 750);
    return () => clearTimeout(timer);
  }, [themeId, customPrimary, appearanceMode]);

  const handleSubmit = (e) => {
    void runSubmit(e);
  };

  return (
    <>
      <LoginVisualEffects />
      <AppVisualEffects />
      <div className="nutri-page-bg login-page-bg login-page-mobile" style={styles.loginPage}>
        <BlurredFoodBackground />
        <div
          style={styles.loginShell}
          className={`login-shell-responsive login-shell-theme-live${themePulse ? " theme-live-pulse" : ""}`}
        >
          <div style={styles.loginBrandPanel} className="login-brand-panel-responsive login-brand-panel-theme-live">
            <div style={styles.loginBrandTop}>
              <div style={styles.loginBrandLogoWrap} className="login-brand-logo-wrap"><HiSparkles size={28} color="currentColor" /></div>
              <h1 style={styles.loginBrandTitle}>NutriAI</h1>
              <p style={styles.loginBrandSubtitle}>แพลตฟอร์มดูแลสุขภาพและโภชนาการแบบรายวัน</p>
              <div style={styles.loginFeatureList}>
                <div style={styles.loginFeatureItem}><HiCheckCircle color={Colors.primaryLight} /> บันทึกมื้ออาหารแบบแยกมื้อ</div>
                <div style={styles.loginFeatureItem}><HiCheckCircle color={Colors.primaryLight} /> วิเคราะห์แคลอรี่และมาโครอัตโนมัติ</div>
                <div style={styles.loginFeatureItem}><HiCheckCircle color={Colors.primaryLight} /> ติดตามแนวโน้มน้ำหนักรายสัปดาห์</div>
              </div>
            </div>
          </div>

          <div style={styles.loginFormPanel} className="login-form-panel-responsive login-form-panel-touch">
            <div style={styles.loginFormHeader} className="login-form-header-mobile">
              <div className="login-mobile-header-main">
                <div className="login-mobile-brand-row">
                  <span className="login-mobile-brand-icon" aria-hidden="true">
                    <HiSparkles size={16} />
                  </span>
                  <p className="login-mobile-brand">NutriAI</p>
                </div>
                <h2 style={styles.loginFormTitle}>{isLogin ? "เข้าสู่ระบบ" : "สร้างบัญชีใหม่"}</h2>
                <p style={styles.loginFormSub}>
                  {isLogin ? "จัดการแผนโภชนาการของคุณในที่เดียว" : "กรอกข้อมูลเพื่อคำนวณแผนสุขภาพส่วนบุคคล"}
                </p>
              </div>
              <div className="login-form-theme-slot">
                <ThemePicker
                  variant="brand"
                  overlayMode="portal"
                  themeId={themeId}
                  appearanceMode={appearanceMode}
                  followDevice={followDevice}
                  customPrimary={customPrimary}
                  onThemeChange={onThemeChange}
                  onAppearanceChange={onAppearanceChange}
                  onFollowDeviceChange={onFollowDeviceChange}
                  onCustomPrimaryChange={onCustomPrimaryChange}
                />
              </div>
            </div>

            {loginError ? (
              <p className="login-error-msg login-error-msg-top" role="alert">{loginError}</p>
            ) : null}

            <div style={styles.loginTabRow}>
              <button
                type="button"
                className={`login-tab-btn login-tab-active-theme${isLogin ? " is-active" : ""}`}
                onClick={() => setIsLogin(true)}
                style={isLogin ? styles.loginTabActive : styles.loginTabInactive}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                className={`login-tab-btn login-tab-active-theme${!isLogin ? " is-active" : ""}`}
                onClick={() => setIsLogin(false)}
                style={!isLogin ? styles.loginTabActive : styles.loginTabInactive}
              >
                สมัครสมาชิก
              </button>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{ width: '100%' }}
              autoComplete="off"
              noValidate
              className="login-form-touch"
            >
              <LoginField label="ชื่อผู้ใช้งาน">
                <input
                  ref={usernameRef}
                  className="login-input-pro"
                  style={styles.loginInput}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  name="nutri-auth-user"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  defaultValue=""
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </LoginField>
              <LoginField label="รหัสผ่าน">
                <input
                  ref={passwordRef}
                  className="login-input-pro"
                  style={styles.loginInput}
                  type="password"
                  placeholder="••••••••"
                  name="nutri-auth-password"
                  autoComplete="new-password"
                  enterKeyHint="go"
                  defaultValue=""
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </LoginField>
              {!isLogin && (
                <div className="login-grid-2-responsive" style={styles.loginGrid2}>
                  <LoginField label="อายุ">
                    <input className="login-input-pro" style={styles.loginInput} type="number" placeholder="21" value={formData.age} onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || "" })} />
                  </LoginField>
                  <LoginField label="เพศ">
                    <select className="login-input-pro" style={styles.loginInput} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                      <option value="Female">หญิง</option>
                      <option value="Male">ชาย</option>
                    </select>
                  </LoginField>
                  <LoginField label="น้ำหนัก (kg)">
                    <input className="login-input-pro" style={styles.loginInput} type="number" placeholder="50" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value, 10) || "" })} />
                  </LoginField>
                  <LoginField label="ส่วนสูง (cm)">
                    <input className="login-input-pro" style={styles.loginInput} type="number" placeholder="160" value={formData.height} onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value, 10) || "" })} />
                  </LoginField>
                </div>
              )}
              {!isLogin && (
                <div className="login-food-avoidance">
                  <FoodAvoidanceEditor
                    preferences={foodPreferences}
                    onChange={setFoodPreferences}
                    compact
                    showHint
                    idPrefix="signup-avoid"
                  />
                </div>
              )}
              <button
                type="submit"
                className="login-submit-btn login-tab-active-theme"
                style={styles.btnLogin}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "กำลังดำเนินการ..."
                  : isLogin
                    ? "เข้าสู่ระบบ"
                    : "ยืนยันการสมัครสมาชิก"}
              </button>
            </form>

            <p style={styles.loginFooterText}>
              {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}{' '}
              <button type="button" onClick={() => setIsLogin(!isLogin)} style={styles.loginFooterLink}>
                {isLogin ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              </button>
            </p>

            <ShareAccessCard variant="login" hideQrOnMobile />

          </div>
        </div>
      </div>
    </>
  );
}
