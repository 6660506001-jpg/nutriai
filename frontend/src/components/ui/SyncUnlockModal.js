import React, { useState } from "react";

export default function SyncUnlockModal({
  username,
  hasDailyLogs,
  busy,
  error,
  hint,
  onSubmit,
  onSkip,
}) {
  const [password, setPassword] = useState("");

  return (
    <div className="sync-unlock-modal" role="dialog" aria-modal="true" aria-labelledby="sync-unlock-title">
      <form
        className="sync-unlock-modal-card"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(password);
        }}
      >
        <h2 id="sync-unlock-title">ซิงค์มื้ออาหาร</h2>
        {hasDailyLogs ? (
          <p>
            เครื่องนี้มีมื้อวันนี้แล้ว กรอกรหัสผ่านเพื่อส่งขึ้นคลาวด์ ให้มือถือดึงไปใช้ได้
          </p>
        ) : (
          <>
            <p>
              เครื่องนี้ยังไม่มีมื้อวันนี้ กรอกรหัสผ่านเพื่อดึงจากคลาวด์
            </p>
            <p className="sync-unlock-modal-steps">
              ถ้าขึ้นว่ายังไม่มีมื้อบนคลาวด์ ให้ไปที่คอมก่อน: เปิดเว็บเดียวกัน เข้าบัญชีนี้ แล้วกดซิงค์เพื่อส่งมื้อขึ้น จากนั้นกลับมากดซิงค์บนมือถืออีกครั้ง
            </p>
          </>
        )}
        <p className="sync-unlock-modal-user">บัญชี: <strong>{username}</strong></p>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="sync-unlock-modal-input"
        />
        {error ? <p className="sync-unlock-modal-error">{error}</p> : null}
        {hint ? <p className="sync-unlock-modal-hint">{hint}</p> : null}
        <button type="submit" className="sync-unlock-modal-btn" disabled={busy}>
          {busy ? "กำลังซิงค์..." : hasDailyLogs ? "ส่งมื้อขึ้นคลาวด์" : "ดึงมื้อจากคลาวด์"}
        </button>
        {hasDailyLogs ? null : (
          <button type="button" className="sync-unlock-modal-skip" onClick={onSkip} disabled={busy}>
            ข้ามไปก่อน
          </button>
        )}
      </form>
    </div>
  );
}
