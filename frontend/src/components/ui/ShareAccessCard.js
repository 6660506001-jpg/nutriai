import React, { useEffect, useState } from "react";
import { HiOutlineClipboardCopy, HiOutlineExternalLink, HiOutlineQrcode } from "react-icons/hi";
import { getPublicAppUrl, isWifiOnlyShareUrl } from "../../constants/config";
import { discoverLanUrl } from "../../utils/discoverLanUrl";

function buildQrImageUrl(url) {
  const params = new URLSearchParams({
    size: "240x240",
    data: url,
    margin: "12",
    format: "png",
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

export default function ShareAccessCard({ variant = "profile", className = "", hideQrOnMobile = false }) {
  const [shareUrl, setShareUrl] = useState(() => getPublicAppUrl());
  const [loading, setLoading] = useState(() => !getPublicAppUrl());
  const wifiOnly = isWifiOnlyShareUrl(shareUrl);

  useEffect(() => {
    const direct = getPublicAppUrl();
    if (direct) {
      setShareUrl(direct);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    discoverLanUrl().then((lanUrl) => {
      if (cancelled) return;
      setShareUrl(lanUrl);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("คัดลอกลิงก์นี้:", shareUrl);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "NutriAI",
          text: "สแกนหรือกดลิงก์เพื่อเปิด NutriAI",
          url: shareUrl,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    handleCopy();
  };

  if (loading) {
    return (
      <section className={`share-access-card share-access-card--loading${className ? ` ${className}` : ""}`}>
        <div className="share-access-card-head">
          <HiOutlineQrcode size={18} aria-hidden />
          <div>
            <p className="share-access-card-title">กำลังสร้าง QR สำหรับมือถือ...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!shareUrl) {
    return (
      <section className={`share-access-card share-access-card--pending${className ? ` ${className}` : ""}`}>
        <div className="share-access-card-head">
          <HiOutlineQrcode size={18} aria-hidden />
          <div>
            <p className="share-access-card-title">สแกน QR เข้าเว็บบนมือถือ</p>
            <p className="share-access-card-note">
              เปิดเว็บจาก IP ใน WiFi (ดูใน terminal ตอน <code>npm start</code>) หรือ deploy บน Vercel แล้วตั้ง{" "}
              <code>REACT_APP_PUBLIC_URL</code>
            </p>
          </div>
        </div>
      </section>
    );
  }

  const qrUrl = buildQrImageUrl(shareUrl);

  return (
    <section
      className={`share-access-card share-access-card--${variant}${className ? ` ${className}` : ""}`}
      aria-label="สแกน QR เพื่อเข้าใช้งาน NutriAI"
    >
      <div className="share-access-card-head">
        <HiOutlineQrcode size={18} aria-hidden />
        <div>
          <p className="share-access-card-title">สแกน QR ด้วยมือถือ — ไม่ต้องพิมพ์ลิงก์</p>
          <p className="share-access-card-note">
            {wifiOnly
              ? "ให้มือถืออยู่ WiFi เดียวกับคอม แล้วสแกน QR นี้เพื่อเปิดเว็บทันที"
              : "สแกน QR หรือกดลิงก์ด้านล่าง — เปิดจากมือถือได้เลย ไม่ต้องพิมพ์ URL"}
          </p>
        </div>
      </div>

      <div className="share-access-card-body">
        <div className={`share-access-qr-wrap${hideQrOnMobile ? " share-access-qr-wrap--desktop-only" : ""}`}>
          <img
            src={qrUrl}
            alt="QR Code สำหรับเปิด NutriAI บนมือถือ"
            className="share-access-qr"
            width={200}
            height={200}
            loading="lazy"
          />
          <p className="share-access-qr-hint">เปิดกล้องมือถือ → สแกน QR นี้</p>
        </div>

        <div className="share-access-link-block">
          <a href={shareUrl} className="share-access-link" target="_blank" rel="noopener noreferrer">
            {shareUrl}
          </a>
          <div className="share-access-actions">
            <button type="button" className="share-access-btn" onClick={handleCopy}>
              <HiOutlineClipboardCopy size={16} aria-hidden />
              {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
            </button>
            <button type="button" className="share-access-btn share-access-btn--primary" onClick={handleShare}>
              แชร์ให้เพื่อน
            </button>
            <a
              href={shareUrl}
              className="share-access-btn share-access-btn--ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HiOutlineExternalLink size={16} aria-hidden />
              เปิดลิงก์
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
