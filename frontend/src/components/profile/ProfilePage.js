import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  HiOutlineUserCircle, HiFire, HiOutlineTrendingUp, HiOutlineIdentification, HiX, HiOutlineLogout, HiOutlineBookOpen,
} from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Colors } from "../../constants/colors";
import { calculateHealthData, calculateMacros } from "../../utils/healthCalculations";
import { getChartThemeColors } from "../../utils/chartTheme";
import { buildWeightTrendView } from "../../utils/weightTrendSimulation";
import { styles } from "../../styles/appStyles";
import { compressProfileImage } from "../../utils/compressProfileImage";
import ProfileMacroBar from "../ui/ProfileMacroBar";
import FoodAvoidanceEditor from "../ui/FoodAvoidanceEditor";
import { normalizeFoodPreferences } from "../../utils/foodPreferences";
export default function ProfilePage({
  user,
  setUser,
  historyData,
  dailyMeals,
  activities,
  onLogout,
  onOpenGuide,
  onNavigateToFood,
  onNavigateToActivity,
}) {
  const fileInputRef = useRef(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ age: user.age, weight: user.weight, height: user.height });
  const [chartColors, setChartColors] = useState(getChartThemeColors);
  const currentData = isEditing ? { ...user, ...editForm } : user;
  const { status, tdee: liveTDEE } = calculateHealthData(currentData);
  const macros = calculateMacros(liveTDEE);

  const {
    data: chartData,
    isFallback: isWeightChartFallback,
    isSimulated: isWeightChartSimulated,
    insight: weightTrendInsight,
    loggedDayCount,
  } = useMemo(
    () => buildWeightTrendView({
      historyData,
      currentWeight: currentData.weight,
      tdee: liveTDEE,
      dailyMeals,
      activities,
    }),
    [historyData, currentData.weight, liveTDEE, dailyMeals, activities],
  );

  useEffect(() => {
    const syncChartColors = () => setChartColors(getChartThemeColors());
    syncChartColors();
    const observer = new MutationObserver(syncChartColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style", "class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleSave = () => { 
    setUser({ ...user, ...editForm }); 
    setIsEditing(false); 
  };

  const handleInputChange = (field, value) => {
    const cleanValue = Math.max(0, parseInt(value, 10) || 0);
    setEditForm({ ...editForm, [field]: cleanValue });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const dataUrl = await compressProfileImage(file);
      setUser((prev) => ({ ...prev, profileImage: dataUrl }));
      setShowAvatarModal(true);
    } catch (error) {
      alert(error.message || "ไม่สามารถอัปโหลดรูปได้");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    if (!window.confirm("ต้องการลบรูปโปรไฟล์ใช่หรือไม่?")) return;
    setUser((prev) => {
      const nextUser = { ...prev };
      delete nextUser.profileImage;
      return nextUser;
    });
    setShowAvatarModal(false);
  };

  const handleAvatarClick = () => {
    if (user.profileImage) {
      setShowAvatarModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleChangeAvatar = () => {
    setShowAvatarModal(false);
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!showAvatarModal) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowAvatarModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAvatarModal]);

  const renderAccountActions = (variant = "top") => {
    const showQuickLinks = variant !== "bottom" && (onNavigateToFood || onNavigateToActivity);
    if (!onOpenGuide && !onLogout && !showQuickLinks) return null;
    return (
      <div className={`profile-account-actions profile-account-actions--${variant}`}>
        <p className="profile-account-actions-label">
          {variant === "bottom" ? "ออกจากบัญชี" : "บัญชีและความช่วยเหลือ"}
        </p>
        {showQuickLinks ? (
          <div className="profile-quick-links">
            {onNavigateToFood ? (
              <button type="button" className="profile-action-btn profile-action-btn--primary" onClick={onNavigateToFood}>
                บันทึกอาหาร
              </button>
            ) : null}
            {onNavigateToActivity ? (
              <button type="button" className="profile-action-btn profile-action-btn--ghost" onClick={onNavigateToActivity}>
                บันทึกกิจกรรม
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="profile-mobile-actions">
          {onOpenGuide && variant !== "bottom" ? (
            <button type="button" className="profile-action-btn profile-action-btn--ghost" onClick={onOpenGuide}>
              <HiOutlineBookOpen size={18} aria-hidden />
              วิธีใช้งาน
            </button>
          ) : null}
          {onLogout ? (
            <button type="button" className="profile-action-btn profile-action-btn--danger" onClick={onLogout}>
              <HiOutlineLogout size={18} aria-hidden />
              ออกจากระบบ
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page" style={styles.pageLayout}>
      <div className="profile-hero-responsive profile-hero-card responsive-card" style={{...styles.card, background: Colors.aiCardBg, color: 'white', position:'relative', borderRadius:'32px', marginBottom: '25px'}}>
        <div style={{position:'absolute', top:'20px', right:'20px'}}>
            {isEditing ? <button onClick={handleSave} style={styles.btnSave}>บันทึก</button> : <button onClick={() => setIsEditing(true)} style={styles.btnEditCircle}><MdEdit /></button>}
        </div>
        <div>
          <div
            style={styles.profileAvatarWrap}
            onClick={handleAvatarClick}
            title={user.profileImage ? "คลิกเพื่อดูรูปโปรไฟล์" : "คลิกเพื่อเพิ่มรูปโปรไฟล์"}
          >
            {user.profileImage ? (
              <img src={user.profileImage} alt="รูปโปรไฟล์" style={styles.profileAvatarImage} />
            ) : (
              <HiOutlineUserCircle size={60} color="rgba(255,255,255,0.9)" />
            )}
            <div style={styles.profileAvatarEditBadge}><MdEdit size={14} /></div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarUpload}
          />
          <p className="profile-avatar-hint" style={styles.profileAvatarHint}>
            {isUploadingAvatar
              ? "กำลังปรับขนาดรูป..."
              : user.profileImage
                ? "คลิกรูปเพื่อดูขนาดเต็ม"
                : "คลิกเพื่อเพิ่มรูปโปรไฟล์ (รองรับรูปจากกล้องมือถือ)"}
          </p>
        </div>
        <div>
          <h1 className="profile-hero-name" style={{ margin: 0 }}>{user.username}</h1>
          <p className="profile-hero-meta" style={{ color: Colors.fat }}>
            สถานะร่างกาย: {status} · เพศ{user.gender === "Female" ? "หญิง" : "ชาย"} {user.age} ปี
          </p>
        </div>
      </div>

      {renderAccountActions("top")}

      {showAvatarModal && user.profileImage ? (
        <div style={styles.avatarModalOverlay} onClick={() => setShowAvatarModal(false)}>
          <div style={styles.avatarModalCard} onClick={(e) => e.stopPropagation()}>
            <button type="button" style={styles.avatarModalCloseBtn} onClick={() => setShowAvatarModal(false)} aria-label="ปิด">
              <HiX size={22} />
            </button>
            <img src={user.profileImage} alt="รูปโปรไฟล์ขนาดเต็ม" style={styles.avatarModalImage} />
            <div className="avatar-modal-actions" style={styles.avatarModalActions}>
              <button type="button" style={styles.avatarModalChangeBtn} onClick={handleChangeAvatar}>เปลี่ยนรูป</button>
              <button type="button" style={styles.avatarModalDeleteBtn} onClick={handleRemoveAvatar}>ลบรูป</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="main-grid-responsive" style={styles.mainGrid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.card} className="hover-lift-card responsive-card">
                <div style={styles.cardTitle}><HiOutlineIdentification color={Colors.primary}/> ข้อมูลร่างกาย</div>
                <div style={styles.profileInfoRow}>
                    <span>เพศ:</span>
                    <b>{user.gender === "Female" ? "หญิง" : "ชาย"}</b>
                </div>
                <div style={styles.profileInfoRow}>
                    <span>อายุ:</span> 
                    {isEditing ? <input type="number" style={styles.inlineInput} value={editForm.age} onChange={(e) => handleInputChange('age', e.target.value)}/> : <b>{user.age} ปี</b>}
                </div>
                <div style={styles.profileInfoRow}>
                    <span>น้ำหนัก:</span> 
                    {isEditing ? <input type="number" style={styles.inlineInput} value={editForm.weight} onChange={(e) => handleInputChange('weight', e.target.value)}/> : <b>{user.weight} kg</b>}
                </div>
                <div style={styles.profileInfoRow}>
                    <span>ส่วนสูง:</span> 
                    {isEditing ? <input type="number" style={styles.inlineInput} value={editForm.height} onChange={(e) => handleInputChange('height', e.target.value)}/> : <b>{user.height} cm</b>}
                </div>
            </div>

            <div style={styles.card} className="hover-lift-card responsive-card">
                <div style={styles.cardTitle}><HiFire color={Colors.primary}/> พลังงาน TDEE และ Macros</div>
                <div style={styles.tdeeBox}><h2 style={{color:Colors.primary, fontSize:'32px'}}>{liveTDEE} <small style={{fontSize:'14px', color:'black'}}>kcal/วัน</small></h2></div>
                <div style={{marginTop:'20px'}}>
                    <ProfileMacroBar label="โปรตีน (30%)" value={`${macros.protein}g`} percent={30} color={Colors.primary} />
                    <ProfileMacroBar label="คาร์บ (40%)" value={`${macros.carbs}g`} percent={40} color={Colors.carbs} />
                    <ProfileMacroBar label="ไขมัน (30%)" value={`${macros.fat}g`} percent={30} color={Colors.fat} />
                </div>
            </div>

            <div style={styles.card} className="hover-lift-card responsive-card food-preferences-card">
                <div style={styles.cardTitle}>อาหารที่หลีกเลี่ยง</div>
                <FoodAvoidanceEditor
                  preferences={user.foodPreferences}
                  onChange={(nextPreferences) => {
                    setUser((prev) => ({
                      ...prev,
                      foodPreferences: normalizeFoodPreferences(nextPreferences),
                    }));
                  }}
                  compact
                  idPrefix="profile-avoid"
                />
            </div>
        </div>

        <div style={styles.card} className="hover-lift-card responsive-card profile-weight-chart-card">
          <div style={{...styles.cardTitle, marginBottom: '20px'}}><HiOutlineTrendingUp color={Colors.primary}/> แนวโน้มน้ำหนัก (7 วันล่าสุด)</div>
          {isWeightChartFallback && (
            <p className="profile-weight-chart-note">
              ยังไม่มีประวัติหลายวัน — แสดงเฉพาะน้ำหนักวันนี้ {currentData.weight} kg (จุดขวาสุด) ใช้แอปต่อเนื่องเพื่อเห็นแนวโน้ม
            </p>
          )}
          {isWeightChartSimulated && (
            <p className="profile-weight-chart-note profile-weight-chart-note--sim">
              {loggedDayCount > 0
                ? `ประมาณจากแคลที่กิน-เผา ${loggedDayCount} วัน (7,700 kcal ≈ 1 kg)`
                : "ประมาณจากน้ำหนักปัจจุบันและแนวโน้มรายวัน"}
            </p>
          )}
          <div className="profile-weight-chart-wrap" style={{ width: '100%', height: 320, marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.04}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: chartColors.textGray}} dy={10} />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  axisLine={false}
                  tickLine={false}
                  tick={{fontSize: 12, fill: chartColors.textGray}}
                  width={42}
                />
                <Tooltip
                  formatter={(value) => [`${value} kg`, "น้ำหนัก"]}
                  contentStyle={{
                    borderRadius: '15px',
                    border: 'none',
                    boxShadow: '0 8px 20px rgba(15,23,42,0.12)',
                    color: '#1E293B',
                  }}
                  labelStyle={{ color: '#475569', fontWeight: 700 }}
                />
                <Area
                    type="monotone"
                    dataKey="weight"
                    connectNulls={false}
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                    dot={{ r: 5, fill: chartColors.primary, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: chartColors.primaryLight, stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '20px', padding: '15px', background: Colors.bgSoft, borderRadius: '15px', fontSize: '13px', textAlign: 'center', color: Colors.textDark }}>
              💡 <b>AI Insight:</b> {weightTrendInsight}
          </div>
        </div>
      </div>

      {renderAccountActions("bottom")}
    </div>
  );
}
