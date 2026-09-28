const estimateDataUrlBytes = (dataUrl) => {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.ceil(base64.length * 0.75);
};

const looksLikeImageFile = (file) => {
  const type = String(file?.type || "").toLowerCase();
  const name = String(file?.name || "").toLowerCase();
  if (!type) return true;
  if (type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|heic|heif|bmp)$/i.test(name);
};

export function compressProfileImage(
  file,
  { maxDimension = 800, maxBytes = 512 * 1024, mimeType = "image/jpeg", quality = 0.85 } = {},
) {
  return new Promise((resolve, reject) => {
    if (!file || !looksLikeImageFile(file)) {
      reject(new Error("กรุณาเลือกไฟล์รูปภาพเท่านั้น"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;
        const scale = Math.min(1, maxDimension / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("ไม่สามารถประมวลผลรูปภาพได้"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let nextQuality = quality;
        let dataUrl = canvas.toDataURL(mimeType, nextQuality);

        while (estimateDataUrlBytes(dataUrl) > maxBytes && nextQuality > 0.45) {
          nextQuality -= 0.08;
          dataUrl = canvas.toDataURL(mimeType, nextQuality);
        }

        if (estimateDataUrlBytes(dataUrl) > maxBytes) {
          const shrink = Math.sqrt(maxBytes / estimateDataUrlBytes(dataUrl));
          canvas.width = Math.max(1, Math.round(width * shrink));
          canvas.height = Math.max(1, Math.round(height * shrink));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL(mimeType, 0.8);
        }

        resolve(dataUrl);
      } catch (error) {
        reject(new Error("ไม่สามารถประมวลผลรูปภาพได้"));
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("อ่านรูปนี้บนมือถือไม่ได้ ลองถ่ายใหม่หรือเลือกรูป JPEG/PNG"));
    };
    img.src = objectUrl;
  });
}
