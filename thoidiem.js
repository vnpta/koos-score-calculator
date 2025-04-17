// thoidiem.js

import {
  collection,
  addDoc,
  serverTimestamp,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

// Hàm lưu thời điểm hoàn thành vào subcollection 'thoidiem'
export async function luuThoiDiemHoanThanh() {
  try {
    const subCollectionRef = collection(doc(db, "1", "dahoanthanh"), "thoidiem");
    await addDoc(subCollectionRef, {
      thoiGian: serverTimestamp()
    });
    console.log("Đã lưu thời điểm hoàn thành.");
  } catch (error) {
    console.error("Lỗi khi lưu thời điểm:", error);
  }
}
