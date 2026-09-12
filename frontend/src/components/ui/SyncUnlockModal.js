import React, { useState } from "react";

export default function SyncUnlockModal({
  username,
  hasLocalLogs,
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
        <p>
          {hasLocalLogs
            ? "เครื่องนี้มีมื้ออาหารแล้ว กรอกรหัสผ่านเพื่อส่งไปมือถือ / เครื่องอื่น"
            : "เครื่องนี้ยังไม่มีมื้อ กรอกรหัสผ่านเพื่อดึงข้อมูลจากคอม"}
        </p>
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
          {busy ? "กำลังซิงค์..." : "ซิงค์ตอนนี้"}
        </button>
        <button type="button" className="sync-unlock-modal-skip" onClick={onSkip} disabled={busy}>
          ข้ามไปก่อน
        </button>
      </form>
    </div>
  );
}
