import React from "react";
import MenuRecommendationCard from "./MenuRecommendationCard";

export default function DashboardHomeMenuPick({
  menu,
  loading = false,
  mealLabel,
  onSelect,
  onDislike,
  onMore,
  onRefresh,
  canRecommend = true,
}) {
  return (
    <section className="dash-home-menu-pick dash-home-menu-block" aria-label="เมนูแนะนำมื้อถัดไป">
      <div className="dash-home-menu-pick-head">
        <h2 className="dash-home-menu-pick-title">เมนูที่ AI เห็นว่าเหมาะที่สุด</h2>
        <div className="dash-home-menu-pick-actions">
          {onRefresh ? (
            <button type="button" className="dash-home-menu-pick-link" onClick={onRefresh} disabled={loading}>
              เมนูถัดไป
            </button>
          ) : null}
          {onMore ? (
            <button type="button" className="dash-home-menu-pick-link" onClick={onMore}>
              ดูทั้งหมด
            </button>
          ) : null}
        </div>
      </div>

      {!canRecommend ? (
        <p className="dash-home-menu-pick-empty">กรอกโปรไฟล์และบันทึกอาหารก่อน แล้วระบบจะแนะนำเมนูให้</p>
      ) : loading ? (
        <p className="dash-home-menu-pick-loading">กำลังเลือกเมนูให้…</p>
      ) : menu ? (
        <MenuRecommendationCard
          menu={menu}
          index={0}
          mealLabel={mealLabel}
          onSelect={onSelect}
          onDislike={onDislike}
          loading={loading}
          variant="home"
        />
      ) : (
        <p className="dash-home-menu-pick-empty">ยังหาเมนูไม่เจอ ลองกด「สุ่มใหม่」หรือไปแท็บ AI</p>
      )}
    </section>
  );
}
