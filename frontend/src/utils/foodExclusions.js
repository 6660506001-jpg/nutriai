const PORK_PATTERN = /หมู|pork|bacon|ham|แฮม|หมูแดง|หมูกรอบ|หมูสับ|คอหมู/i;

export const containsPork = (text) => PORK_PATTERN.test(String(text || ""));

export const menuItemContainsPork = (item) => {
  if (!item) return false;
  if (containsPork(item.name)) return true;
  if (Array.isArray(item.names)) {
    return item.names.some((name) => containsPork(name));
  }
  return false;
};

export const excludePorkMenus = (items) =>
  (Array.isArray(items) ? items : []).filter((item) => !menuItemContainsPork(item));

export const excludePorkThaiFoodItems = (foods) =>
  (Array.isArray(foods) ? foods : []).filter(
    (item) => !(item.names || []).some((name) => containsPork(name)),
  );
