import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('user', username); // จำชื่อผู้ใช้ไว้
      navigate('/dashboard'); // ไปหน้าหลัก
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{ color: '#2E7D32' }}>🥗 Nutrition AI</h2>
        <p>กรุณาเข้าสู่ระบบ</p>
        <input 
          type="text" 
          placeholder="ชื่อผู้ใช้งาน" 
          style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd' }}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2E7D32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}

export default Login;