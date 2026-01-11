import CryptoJS from "crypto-js";

// المفتاح السري (يمكن نقله إلى env)
const SECRET_KEY = "MY_SUPER_SECRET_KEY_123";

// تشفير
export const encryptToken = (token) => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// فك التشفير
export const decryptToken = (encryptedToken) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};
