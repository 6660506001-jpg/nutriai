import React from "react";
import { styles } from "../../styles/appStyles";

export default function LoginField({ label, children }) {
  return (
    <div className="login-field" style={styles.loginField}>
      <label style={styles.loginLabel}>{label}</label>
      {children}
    </div>
  );
}
