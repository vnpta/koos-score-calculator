import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

export async function luuThoiDiemHoanThanh() {
  try {
    await addDoc(collection(db, "hoanthanh"), {
      thoigian: serverTimestamp()
    });
    console.log("Đã lưu thời điểm hoàn thành.");
  } catch (error) {
    console.error("Lỗi khi lưu thời điểm:", error);
  }
}

window.luuThoiDiemHoanThanh = luuThoiDiemHoanThanh;
