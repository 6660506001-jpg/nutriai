import React from "react";
import { HiOutlineLightBulb } from "react-icons/hi";

export default function AppPageHint({ text }) {
  if (!text) return null;

  return (
    <div className="app-page-hint" role="note">
      <HiOutlineLightBulb className="app-page-hint-icon" aria-hidden />
      <p className="app-page-hint-text">{text}</p>
    </div>
  );
}
