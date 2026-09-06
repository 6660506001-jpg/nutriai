# NutriAI — Deploy ฟรี (ไม่ต้องซื้อโดเมน)

คู่มือนี้จะได้ลิงก์แบบนี้:
- **Frontend:** `https://nutriai-xxxx.vercel.app`
- **Backend:** `https://nutriai-api-xxxx.up.railway.app`

ผู้ใช้เปิดลิงก์ Vercel จาก 4G / WiFi ไหนก็ได้

---

## สิ่งที่ต้องเตรียม

1. บัญชี [GitHub](https://github.com) (ฟรี)
2. บัญชี [Vercel](https://vercel.com) (ฟรี) — สำหรับ frontend
3. บัญชี [Railway](https://railway.app) (มี free trial / credit) — สำหรับ backend + MySQL

---

## ขั้นที่ 1 — อัปโหลดโค้ดขึ้น GitHub

1. สร้าง repo ใหม่บน GitHub ชื่อ `nutriai` (Private หรือ Public ก็ได้)
2. เปิด Terminal ในโฟลเดอร์โปรเจกต์:

```powershell
cd "c:\Users\ACER\OneDrive\Desktop\my_project"
git init -b main
git add .
git commit -m "Prepare NutriAI for cloud deploy"
git remote add origin https://github.com/ชื่อคุณ/nutriai.git
git push -u origin main
```

> อย่า commit ไฟล์ `.env` ที่มีรหัสผ่านจริง — มี `.gitignore` กันไว้แล้ว

---

## ขั้นที่ 2 — Deploy Backend + MySQL บน Railway

### 2.1 สร้างโปรเจกต์

1. เข้า [railway.app](https://railway.app) → **New Project**
2. เลือก **Deploy from GitHub repo** → เลือก repo `nutriai`
3. ตั้ง **Root Directory** = `backend`
4. Railway จะ detect Python และรัน `uvicorn` อัตโนมัติ

### 2.2 เพิ่ม MySQL

1. ในโปรเจกต์ Railway → **+ New** → **Database** → **MySQL**
2. รอ MySQL สร้างเสร็จ

### 2.3 เชื่อม Backend กับ MySQL

1. คลิก service **backend** → **Variables**
2. เพิ่มตัวแปร (ใช้ Reference จาก MySQL service):

| ชื่อ | ค่า (Reference) |
|------|-----------------|
| `MYSQLHOST` | `${{MySQL.MYSQLHOST}}` |
| `MYSQLPORT` | `${{MySQL.MYSQLPORT}}` |
| `MYSQLUSER` | `${{MySQL.MYSQLUSER}}` |
| `MYSQLPASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `MYSQLDATABASE` | `${{MySQL.MYSQLDATABASE}}` |

3. เพิ่ม `FRONTEND_URL` ทีหลัง (หลังได้ URL จาก Vercel)

### 2.4 สร้างตารางใน MySQL

1. คลิก MySQL service → **Data** หรือ **Connect** → เปิด Query tab
2. คัดลอกเนื้อหาจาก `backend/schema.sql` แล้วรัน

### 2.5 เปิด Public URL ของ Backend

1. คลิก backend service → **Settings** → **Networking** → **Generate Domain**
2. ได้ URL เช่น `https://nutriai-production.up.railway.app`
3. ทดสอบ: เปิด `https://nutriai-production.up.railway.app/health`

---

## ขั้นที่ 3 — Deploy Frontend บน Vercel

1. เข้า [vercel.com](https://vercel.com) → **Add New Project**
2. Import repo GitHub `nutriai`
3. ตั้ง **Root Directory** = `frontend`
4. **Environment Variables:**

| Name | Value |
|------|-------|
| `REACT_APP_API_BASE_URL` | URL backend จาก Railway |

5. กด **Deploy** → ได้ลิงก์ `https://nutriai-xxxx.vercel.app`

### อัปเดต CORS บน Railway

```
FRONTEND_URL=https://nutriai-xxxx.vercel.app
```

แล้ว Redeploy backend

---

## ขั้นที่ 4 — ทดสอบ

1. เปิดลิงก์ Vercel บนมือถือ (ใช้ 4G)
2. สมัครสมาชิกใหม่ → ล็อกอิน → ค้นหาอาหาร

---

## แก้ปัญหาที่พบบ่อย

| อาการ | วิธีแก้ |
|--------|---------|
| เชื่อมต่อ backend ไม่ได้ | ตรวจ `REACT_APP_API_BASE_URL` ใน Vercel แล้ว Redeploy |
| DB Connection Failed | ตรวจ MYSQL* variables + รัน `schema.sql` |
| CORS error | ตั้ง `FRONTEND_URL` บน Railway ให้ตรง URL Vercel |

---

## สรุป

แชร์ **ลิงก์ Vercel** ให้ผู้ใช้ — ไม่ต้องซื้อโดเมน ไม่ต้อง WiFi เดียวกัน
