import React from "react";
import { HiOutlineUserCircle, HiOutlineLogout, HiOutlineBookOpen } from "react-icons/hi";
import { MdOutlineSpaceDashboard, MdHistory, MdRestaurant, MdMenuBook, MdDirectionsRun } from "react-icons/md";
import { Colors } from "../../constants/colors";
import { styles } from "../../styles/appStyles";
import { useIsMobile } from "../../hooks/useIsMobile";

const navColor = (active) => (active ? Colors.primaryLight : "rgba(255,255,255,0.78)");

const DESKTOP_NAV_ITEMS = [
  { id: "dashboard", icon: MdOutlineSpaceDashboard, label: "หน้าหลัก", short: "หลัก", hint: "สรุปวันนี้" },
  { id: "food", icon: MdRestaurant, label: "บันทึกอาหาร", short: "บันทึก", hint: "บันทึกมื้อ" },
  { id: "activity", icon: MdDirectionsRun, label: "กิจกรรม", short: "กิจกรรม", hint: "เผาแคล" },
  { id: "meals", icon: MdMenuBook, label: "เมนู AI", short: "เมนู", hint: "แนะนำมื้อ" },
  { id: "history", icon: MdHistory, label: "ประวัติ", short: "ประวัติ", hint: "ดูแนวโน้ม" },
  { id: "profile", icon: HiOutlineUserCircle, label: "โปรไฟล์", short: "โปรไฟล์", hint: "ตั้งค่า" },
];

const MOBILE_NAV_ITEMS = [
  { id: "dashboard", icon: MdOutlineSpaceDashboard, label: "หน้าหลัก", short: "หลัก", hint: "สรุปวันนี้" },
  { id: "food", icon: MdRestaurant, label: "บันทึกอาหาร", short: "อาหาร", hint: "บันทึกมื้อ" },
  { id: "activity", icon: MdDirectionsRun, label: "กิจกรรม", short: "กิจกรรม", hint: "เผาแคล" },
  { id: "meals", icon: MdMenuBook, label: "เมนู AI", short: "AI", hint: "แนะนำมื้อ" },
  { id: "history", icon: MdHistory, label: "ประวัติ", short: "ประวัติ", hint: "ดูแนวโน้ม" },
  { id: "profile", icon: HiOutlineUserCircle, label: "โปรไฟล์", short: "โปรไฟล์", hint: "ตั้งค่า" },
];

function resolveMobileActiveTab(activeTab) {
  if (MOBILE_NAV_ITEMS.some((item) => item.id === activeTab)) return activeTab;
  return activeTab;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, onOpenGuide }) {
  const isMobile = useIsMobile();
  const navItems = isMobile ? MOBILE_NAV_ITEMS : DESKTOP_NAV_ITEMS;
  const resolvedActive = isMobile ? resolveMobileActiveTab(activeTab) : activeTab;

  return (
    <aside className={`app-sidebar${isMobile ? " app-sidebar--mobile" : ""}`} style={styles.sidebar}>
      <div className="sidebar-logo-wrap">
        <div style={styles.logo} className="sidebar-brand">NutriAI</div>
      </div>
      <div className="sidebar-links-wrap">
        {navItems.map(({ id, icon: Icon, label, short, hint }) => (
          <div
            key={id}
            className={`nav-link-pro ${resolvedActive === id ? "nav-link-active" : ""}`}
            onClick={() => setActiveTab(id)}
            style={{ ...styles.navLink, color: navColor(resolvedActive === id), cursor: "pointer" }}
            role="button"
            tabIndex={0}
            aria-label={`${label} — ${hint}`}
            aria-current={resolvedActive === id ? "page" : undefined}
            title={hint}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveTab(id);
              }
            }}
          >
            <Icon aria-hidden />
            <span className="nav-link-label-full">{label}</span>
            <span className="nav-link-label-short">{short}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-footer-actions">
        <button type="button" className="sidebar-guide-btn" onClick={onOpenGuide}>
          <HiOutlineBookOpen size={18} aria-hidden />
          <span className="nav-link-label-full">วิธีใช้งาน</span>
          <span className="nav-link-label-short">คู่มือ</span>
        </button>
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={onLogout}
        >
          <HiOutlineLogout aria-hidden />
          <span className="nav-link-label-full">ออก</span>
          <span className="nav-link-label-short">ออก</span>
        </button>
      </div>
    </aside>
  );
}
