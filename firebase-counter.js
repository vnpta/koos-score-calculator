import { getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

export async function hienThiSoLuong() {
  try {
    const docRef = doc(db, "1", "dahoanthanh");
    const docSnap = await getDoc(docRef);
    const count = docSnap.exists() ? docSnap.data().soluong || 0 : 0;

    const completionElement = document.getElementById("completionCount");
    completionElement.innerText = "Số lượt hoàn thành khảo sát: " + count;

    // Căn phải phần tử
    completionElement.style.textAlign = "right";  // Căn phải
    completionElement.style.fontSize = "20px";    // Chỉnh cỡ chữ
    completionElement.style.paddingRight = "20px"; // Cách lề phải 20px
  } catch (error) {
    console.error("Lỗi khi đọc số lượng:", error);
  }
}

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

document.addEventListener("DOMContentLoaded", hienThiSoLuong);
window.onSurveyCompleted = tangSoLuongHoanThanh;
