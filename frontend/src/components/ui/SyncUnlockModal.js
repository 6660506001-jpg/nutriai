import React, { useState } from "react";

export default function SyncUnlockModal({
  username,
  hasDailyLogs,
  isPhone = false,
  busy,
  error,
  hint,
  onSubmit,
  onSkip,
}) {
  const [password, setPassword] = useState("");
  const hintIsSuccess = String(hint || "").startsWith("ส่งสำเร็จ") || String(hint || "").startsWith("ซิงค์แล้ว");

  let description = "กรอกรหัสผ่านเพื่อดึงมื้อวันนี้จากคลาวด์";
  let actionLabel = "ดึงมื้อจากคลาวด์";
  if (hasDailyLogs && isPhone) {
    description = "มื้อวันนี้มีบนมือถือแล้ว กรอกรหัสผ่านหากต้องการบันทึกลงคลาวด์ด้วย";
    actionLabel = "บันทึกลงคลาวด์";
  } else if (hasDailyLogs) {
    description = "หน้านี้มียอดวันนี้แล้ว กรอกรหัสผ่านเพื่อส่งให้มือถือ";
    actionLabel = "ส่งมื้อขึ้นคลาวด์";
  }

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
        <p>{description}</p>
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
        {hint ? (
          <p className={`sync-unlock-modal-hint${hintIsSuccess ? " is-success" : ""}`}>{hint}</p>
        ) : null}
        <button type="submit" className="sync-unlock-modal-btn" disabled={busy}>
          {busy ? "กำลังซิงค์..." : actionLabel}
        </button>
        <button type="button" className="sync-unlock-modal-skip" onClick={onSkip} disabled={busy}>
          ปิด
        </button>
      </form>
    </div>
  );
}
