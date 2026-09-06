/** เมนูแนะนำนอกบ้าน — ค่าโภชนาการประมาณต่อเซ็ต */

export const VENUE_MODES = [
  { id: "home", label: "ทำเอง", icon: "🍳" },
  { id: "seven", label: "เซเว่น", icon: "🏪" },
  { id: "tamsung", label: "ตามสั่ง", icon: "🍜" },
];

export const SEVEN_ELEVEN_MENUS = [
  {
    name: "อกไก่นุ่มกระเทียมพริกไทย + ไข่ต้ม 1 ฟอง + ข้าวกล้องถ้วยเล็ก",
    calories: 245,
    protein: 28,
    carbs: 18,
    fat: 7,
    category: "lean-protein",
    venue: "seven",
    orderTip: "เลือกข้าวกล้องถ้วยเล็ก ไม่ต้องเพิ่มซอส",
  },
  {
    name: "อกไก่ย่างแพ็ค + สลัดผักสำเร็จรูป + นมไขมันต่ำ 1 กล่อง",
    calories: 270,
    protein: 30,
    carbs: 20,
    fat: 8,
    category: "lean-protein",
    venue: "seven",
    orderTip: "สลัดไม่ใส่ซอสครีม นมเลือกไม่หวาน",
  },
  {
    name: "แซนด์วิชไก่โฮลวีท + โยเกิร์ตไขมันต่ำ + กล้วย 1 ลูก",
    calories: 310,
    protein: 22,
    carbs: 38,
    fat: 9,
    category: "light",
    venue: "seven",
    orderTip: "เหมาะมื้อเช้า/มื้อเบา หลีกเลี่ยงชานม",
  },
  {
    name: "สลัดทูน่าแพ็ค + ไข่ต้ม 2 ฟอง",
    calories: 220,
    protein: 26,
    carbs: 8,
    fat: 10,
    category: "salad",
    venue: "seven",
    orderTip: "ทูน่าในน้ำแร่ ไม่ใช่ในน้ำมัน",
  },
  {
    name: "โจ๊กไก่ถ้วยเล็ก + ไข่ต้ม 1 ฟอง",
    calories: 230,
    protein: 20,
    carbs: 26,
    fat: 6,
    category: "light",
    venue: "seven",
    orderTip: "โจ๊กถ้วยเล็กพอ ไม่ต้องเพิ่มเครื่องทอด",
  },
  {
    name: "ข้าวกล้องแพ็ค + ปลาซาบะย่าง + ผักดอง",
    calories: 255,
    protein: 24,
    carbs: 28,
    fat: 7,
    category: "lean-protein",
    venue: "seven",
    orderTip: "ข้าวกล้องครึ่งแพ็คถ้าแคลเหลือน้อย",
  },
];

export const TAMSUNG_MENUS = [
  {
    name: "เกาเหลาอกไก่ชิ้นพิเศษผัก ไม่เจียวกระเทียม",
    calories: 240,
    protein: 22,
    carbs: 22,
    fat: 8,
    category: "soup",
    venue: "tamsung",
    orderTip: "สั่ง: ไม่เจียวกระเทียม ไม่ใส่เครื่องใน น้ำซุปใส",
  },
  {
    name: "ข้าวราดไก่ตุ๋น (เนื้อเปล่า) + น้ำซุปใส",
    calories: 260,
    protein: 24,
    carbs: 30,
    fat: 6,
    category: "lean-protein",
    venue: "tamsung",
    orderTip: "เอาน้ำมันออก ไม่ราดน้ำมัน ข้าว 3/4 ทัพพี",
  },
  {
    name: "ต้มจืดเต้าหู้ไก่สับ + ข้าว 1/2 ทัพพี",
    calories: 220,
    protein: 16,
    carbs: 28,
    fat: 6,
    category: "soup",
    venue: "tamsung",
    orderTip: "ข้าวครึ่งทัพพี ไม่ต้องไข่เจียว",
  },
  {
    name: "ผัดผักรวมมิตร + อกไก่ + ข้าว 1/2 ทัพพี",
    calories: 250,
    protein: 26,
    carbs: 22,
    fat: 8,
    category: "lean-protein",
    venue: "tamsung",
    orderTip: "สั่งผัดน้ำมันน้อย ไม่ใส่ของทอด",
  },
  {
    name: "ก๋วยเตี๋ยวน้ำใสไก่ เนื้อสั่งพิเศษ ไม่ใส่เครื่องทอด",
    calories: 280,
    protein: 22,
    carbs: 36,
    fat: 6,
    category: "noodle-rice",
    venue: "tamsung",
    orderTip: "เส้นเล็กน้อย ไม่ทานน้ำมัน ไม่ใส่ลูกชิ้นทอด",
  },
  {
    name: "ข้าวผัดกะเพราไก่ (ไก่ล้วน) ไม่ใส่ไข่ดาว",
    calories: 270,
    protein: 20,
    carbs: 32,
    fat: 8,
    category: "noodle-rice",
    venue: "tamsung",
    orderTip: "สั่งไก่ล้วน ไม่ใส่ไข่ดาว ข้าวน้อย",
  },
];

export const getOutOfHomeCatalog = (venueMode) => {
  if (venueMode === "seven") return SEVEN_ELEVEN_MENUS;
  if (venueMode === "tamsung") return TAMSUNG_MENUS;
  return [];
};

export const getVenueModeLabel = (venueMode) =>
  VENUE_MODES.find((mode) => mode.id === venueMode)?.label || "ทั่วไป";
