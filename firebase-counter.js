import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Giả sử bạn đã khởi tạo Firebase và export `db` từ file firebase-config.js
import { db } from './firebase-config.js';

// Hàm hiển thị số lượt hoàn thành
export async function hienThiSoLuong() {
  try {
    const docRef = doc(db, "1", "dahoanthanh");
    const docSnap = await getDoc(docRef);
    const count = docSnap.exists() ? docSnap.data().soluong || 0 : 0;
    document.getElementById("completionCount").innerText = "Số lượt hoàn thành khảo sát: " + count;
  } catch (error) {
    console.error("Lỗi khi đọc số lượng:", error);
  }
}

// Hàm tăng số lượt hoàn thành
export async function tangSoLuongHoanThanh() {
  try {
    const docRef = doc(db, "1", "dahoanthanh");
    const docSnap = await getDoc(docRef);
    const current = docSnap.exists() ? docSnap.data().soluong || 0 : 0;
    await setDoc(docRef, { soluong: current + 1 });
    hienThiSoLuong();
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
  }
}

// Tự động hiển thị số lượt khi trang tải
document.addEventListener("DOMContentLoaded", hienThiSoLuong);

// Cho phép gọi từ HTML khác
window.onSurveyCompleted = tangSoLuongHoanThanh;
