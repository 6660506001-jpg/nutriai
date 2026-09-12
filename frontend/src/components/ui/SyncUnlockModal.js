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
  const hintIsSuccess = String(hint || "").startsWith("ส่งสำเร็จ");

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
            หน้านี้มียอดวันนี้แล้ว กรอกรหัสผ่านแล้วกดส่งขึ้นคลาวด์ จากนั้นค่อยไปดึงบนมือถือ
          </p>
        ) : (
          <>
            <p>มือถือยังไม่มีมื้อวันนี้</p>
            <p className="sync-unlock-modal-steps">
              ให้เปิดหน้าคอมที่เห็นยอดอาหารวันนี้แล้ว (พลังงานที่ได้รับไม่เป็น 0)
              แล้วกดส่งมื้อขึ้นคลาวด์จนขึ้นว่าส่งสำเร็จ
              ถ้าเปิดแท็บใหม่ที่ยังเป็น 0 จะส่งมื้อไม่ได้
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
        {hint ? (
          <p className={`sync-unlock-modal-hint${hintIsSuccess ? " is-success" : ""}`}>{hint}</p>
        ) : null}
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
