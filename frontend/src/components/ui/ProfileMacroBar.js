import React from "react";

export default function ProfileMacroBar({ label, value, percent, color }) {
  return (
    <div style={{marginBottom:'10px'}}>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px'}}><span>{label}</span><b>{value}</b></div>
      <div style={{width:'100%', height:'8px', background:'#eee', borderRadius:'10px', overflow:'hidden', marginTop:'5px'}}><div style={{width:`${percent}%`, height:'100%', background:color}}></div></div>
    </div>
  );
}
